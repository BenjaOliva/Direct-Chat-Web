"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import * as XLSX from "xlsx"
import { Upload, FileDown, AlertCircle, CheckCircle, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { translations } from "@/lib/translations"

type SavedContact = {
  id: string
  name: string
  phone: string
  countryCode?: string
}

interface ContactImporterProps {
  isOpen: boolean
  onClose: () => void
  onImport: (contacts: SavedContact[]) => void
  language: "es" | "en"
}

export function ContactImporter({ isOpen, onClose, onImport, language }: ContactImporterProps) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const t = translations[language]

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
        setError(null)
        setSuccess(null)
        const file = acceptedFiles[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer)
                const workbook = XLSX.read(data, { type: "array" })
                const sheetName = workbook.SheetNames[0]
                const worksheet = workbook.Sheets[sheetName]
                const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[]

                if (jsonData.length === 0) {
                    setError(t.noContactsFound)
                    return
                }

                // Validation
                const requiredHeaders = ["Name", "Phone", "CountryCode"]
                const firstRow = jsonData[0]
                const headers = Object.keys(firstRow)
                
                // Check if all required headers are present (case insensitive check could be better but let's stick to strict for now or normalize)
                // Let's normalize keys to lowercase for check
                const normalizedHeaders = headers.map(h => h.toLowerCase())
                const missing = requiredHeaders.filter(h => !normalizedHeaders.includes(h.toLowerCase()))

                if (missing.length > 0) {
                    setError(`${t.missingHeaders} (${missing.join(", ")})`)
                    return
                }

                const parsedContacts: SavedContact[] = jsonData.map((row: any, index: number) => {
                     // Map keys case-insensitively
                     const getVal = (key: string) => {
                         const foundKey = Object.keys(row).find(k => k.toLowerCase() === key.toLowerCase())
                         return foundKey ? row[foundKey] : ""
                     }
                    
                    return {
                        id: Date.now().toString() + index,
                        name: getVal("Name") || "",
                        phone: String(getVal("Phone") || ""),
                        countryCode: String(getVal("CountryCode") || "")
                    }
                }).filter(c => c.name && c.phone)

                if (parsedContacts.length === 0) {
                    setError(t.noContactsFound)
                    return
                }

                onImport(parsedContacts)
                setSuccess(`${t.importSuccess} (${parsedContacts.length})`)
                setTimeout(() => {
                    onClose()
                    setSuccess(null)
                    setError(null)
                }, 1500)

            } catch (err) {
                console.error(err)
                setError(t.importError)
            }
        }
        reader.readAsArrayBuffer(file)
    },
    [onImport, onClose, t]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
    maxFiles: 1,
  })

  const downloadTemplate = () => {
    const templateData = [
        { Name: "John Doe", Phone: "123456789", CountryCode: "+1" },
        { Name: "Maria Garcia", Phone: "612345678", CountryCode: "+34" }
    ]
    const ws = XLSX.utils.json_to_sheet(templateData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Template")
    XLSX.writeFile(wb, "contacts_template.xlsx")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.importContacts}</DialogTitle>
          <DialogDescription>
            {t.dropFilesHere}
          </DialogDescription>
        </DialogHeader>
        
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors
            flex flex-col items-center justify-center gap-4
            ${isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-primary/50"}
          `}
        >
          <input {...getInputProps()} />
          <Upload className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {isDragActive ? "Drop here..." : t.dropFilesHere}
          </p>
        </div>

        {error && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t.validationErrorTitle}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {success && (
             <Alert className="text-green-600 border-green-600">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
            </Alert>
        )}

        <DialogFooter className="sm:justify-between gap-2">
           <Button variant="outline" size="sm" onClick={downloadTemplate} className="gap-2">
             <FileSpreadsheet className="h-4 w-4" />
             {t.downloadTemplate}
           </Button>
           <Button type="button" variant="secondary" onClick={onClose}>
             {t.cancel}
           </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
