"use client";

import { useState, useEffect, useMemo } from "react";
import {
  MessageSquare,
  Phone,
  Save,
  Trash2,
  BookmarkCheck,
  Languages,
  Plus,
  Edit,
  X,
  Search,
  Monitor,
  Users,
  Moon,
  Sun,
  Download,
  Upload,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { toast } from "sonner";
import { z } from "zod";
import { translations } from "@/lib/translations";
import { countries } from "@/lib/countries";
import { useIsMobile } from "@/components/ui/use-mobile";
import { useTheme } from "next-themes";
import * as XLSX from "xlsx";
import { ContactImporter } from "@/components/contact-importer";

const contactSchema = z.object({
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 digits")
    .max(20, "Phone number must be at most 20 digits")
    .regex(
      /^[0-9+\s-]+$/,
      "Phone number must contain only numbers, +, spaces, or -"
    ),
  message: z
    .string()
    .max(500, "Message must be at most 500 characters")
    .optional(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be at most 50 characters")
    .optional(),
});

type SavedContact = {
  id: string;
  name: string;
  phone: string;
  countryCode?: string;
};

type CustomMessage = {
  id: string;
  text: string;
  isDefault?: boolean;
};

export default function DirectChatPage() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [contactName, setContactName] = useState("");
  const [savedContacts, setSavedContacts] = useState<SavedContact[]>([]);
  const [errors, setErrors] = useState<{
    phone?: string;
    message?: string;
    name?: string;
  }>({});
  const [language, setLanguage] = useState<"es" | "en">("es");
  const [countryCode, setCountryCode] = useState("+1");
  const [customMessages, setCustomMessages] = useState<CustomMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [editingMessage, setEditingMessage] = useState<CustomMessage | null>(
    null
  );
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMethod, setOpenMethod] = useState<"web" | "app">("web");
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const isMobile = useIsMobile();
  const t = translations[language];
  const { theme, setTheme } = useTheme();

  const filteredContacts = useMemo(() => {
    if (!searchQuery) return savedContacts;
    const lowerQuery = searchQuery.toLowerCase();
    return savedContacts.filter(
      (c) =>
        c.name.toLowerCase().includes(lowerQuery) ||
        c.phone.includes(lowerQuery)
    );
  }, [savedContacts, searchQuery]);

  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        const country = countries.find((c) => c.code === data.country_code);
        if (country) {
          setCountryCode(country.dial);
        }
      } catch (error) {
        console.log("Failed to detect country, using default");
      }
    };
    detectCountry();
  }, []);

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage === "es" || storedLanguage === "en") {
      setLanguage(storedLanguage);
    } else {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith("en")) {
        setLanguage("en");
      } else {
        setLanguage("es");
      }
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("whatsapp-contacts");
    if (stored) {
      try {
        setSavedContacts(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse contacts", e);
      }
    }

    const storedMessages = localStorage.getItem("custom-messages");
    if (storedMessages) {
      try {
        setCustomMessages(JSON.parse(storedMessages));
      } catch (e) {
        console.error("Failed to parse custom messages", e);
      }
    } else {
      const defaultMessages: CustomMessage[] = t.suggestions.map(
        (text, index) => ({
          id: `default-${index}`,
          text,
          isDefault: true,
        })
      );
      setCustomMessages(defaultMessages);
      localStorage.setItem("custom-messages", JSON.stringify(defaultMessages));
    }
  }, []);

  useEffect(() => {
    const storedMessages = localStorage.getItem("custom-messages");
    if (storedMessages) {
      try {
        const parsed = JSON.parse(storedMessages) as CustomMessage[];
        const updatedMessages = parsed.map((msg) => {
          if (msg.isDefault) {
            const index = Number.parseInt(msg.id.replace("default-", ""));
            if (!isNaN(index) && t.suggestions[index]) {
              return { ...msg, text: t.suggestions[index] };
            }
          }
          return msg;
        });
        setCustomMessages(updatedMessages);
        localStorage.setItem(
          "custom-messages",
          JSON.stringify(updatedMessages)
        );
      } catch (e) {
        console.error("Failed to update messages", e);
      }
    }
  }, [language]);

  const saveContactsToStorage = (contacts: SavedContact[]) => {
    localStorage.setItem("whatsapp-contacts", JSON.stringify(contacts));
    setSavedContacts(contacts);
  };

  const saveCustomMessages = (messages: CustomMessage[]) => {
    localStorage.setItem("custom-messages", JSON.stringify(messages));
    setCustomMessages(messages);
  };

  const handleOpenChat = () => {
    setErrors({});

    const fullPhone = phone.startsWith("+") ? phone : `${countryCode}${phone}`;
    const result = contactSchema.safeParse({
      phone: fullPhone,
      message: message || undefined,
    });

    if (!result.success) {
      const fieldErrors: { phone?: string; message?: string; name?: string } =
        {};

      if (result.error && result.error.errors) {
        result.error.errors.forEach((err) => {
          const field = err.path[0] as "phone" | "message" | "name";
          if (field) {
            fieldErrors[field] = err.message;
          }
        });
      }

      setErrors(fieldErrors);

      toast.error(t.error, {
        description: t.validationError,
      });
      return;
    }

    const cleanPhone = fullPhone.replace(/[\s-]/g, "");
    const encodedMessage = message ? encodeURIComponent(message) : "";

    let whatsappUrl = `https://wa.me/${cleanPhone}${
      encodedMessage ? `?text=${encodedMessage}` : ""
    }`;

    if (!isMobile && openMethod === "app") {
      // WhatsApp Desktop protocol
      whatsappUrl = `whatsapp://send?phone=${cleanPhone}${
        encodedMessage ? `&text=${encodedMessage}` : ""
      }`;
    } else if (!isMobile) {
      // WhatsApp Web
      whatsappUrl = `https://web.whatsapp.com/send?phone=${cleanPhone}${
        encodedMessage ? `&text=${encodedMessage}` : ""
      }`;
    }

    if (isMobile) {
      // Mobile always uses wa.me or api.whatsapp.com which redirects to app
      whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}${
        encodedMessage ? `&text=${encodedMessage}` : ""
      }`;
    }

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    toast.success(t.chatOpened, {
      description: t.chatOpenedDesc,
    });
  };

  const handleSaveContact = () => {
    if (!contactName.trim()) {
      setErrors({ ...errors, name: t.nameRequired });
      return;
    }

    if (!phone.trim()) {
      setErrors({ ...errors, phone: t.phoneRequired });
      return;
    }

    const isDuplicate = savedContacts.some(
      (c) => c.phone === phone && c.countryCode === countryCode
    );
    if (isDuplicate) {
      toast.error(t.error, {
        description: t.duplicateContact,
      });
      return;
    }

    const newContact: SavedContact = {
      id: Date.now().toString(),
      name: contactName,
      phone: phone, // Save ONLY local number
      countryCode: countryCode, // Save country code separately
    };

    const updated = [...savedContacts, newContact];
    saveContactsToStorage(updated);

    toast.success(t.contactSaved, {
      description: t.contactSavedDesc,
    });

    setContactName("");
  };

  const handleDeleteContact = (id: string) => {
    const contactToDelete = savedContacts.find((c) => c.id === id);
    const updated = savedContacts.filter((c) => c.id !== id);
    saveContactsToStorage(updated);

    toast.success(t.contactDeleted, {
      description: t.contactDeletedDesc,
      action: {
        label: t.undo,
        onClick: () => {
          if (contactToDelete) {
            const restored = [...updated, contactToDelete];
            saveContactsToStorage(restored);
          }
        },
      },
    });
  };

  const handleLoadContact = (contact: SavedContact) => {
    if (contact.countryCode) {
      setCountryCode(contact.countryCode);
      setPhone(contact.phone);
    } else {
      if (contact.phone.startsWith(countryCode)) {
        setPhone(contact.phone.slice(countryCode.length));
      } else {
        setPhone(contact.phone);
      }
    }

    setContactName(contact.name);
    setErrors({});

    toast.info(t.contactLoaded, {
      description: `${contact.name} - ${contact.countryCode || ""} ${
        contact.phone
      }`,
    });
  };

  const handleSuggestedMessage = (msg: string) => {
    setMessage(msg);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const newLang = prev === "es" ? "en" : "es";
      localStorage.setItem("language", newLang);
      return newLang;
    });
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleAddCustomMessage = () => {
    if (!newMessageText.trim()) return;

    const newMessage: CustomMessage = {
      id: Date.now().toString(),
      text: newMessageText.trim(),
      isDefault: false,
    };

    const updated = [...customMessages, newMessage];
    saveCustomMessages(updated);

    toast.success(t.messageAdded, {
      description: t.messageAddedDesc,
    });

    setNewMessageText("");
    setIsMessageDialogOpen(false);
  };

  const handleEditCustomMessage = () => {
    if (!editingMessage || !newMessageText.trim()) return;

    const updated = customMessages.map((m) =>
      m.id === editingMessage.id ? { ...m, text: newMessageText.trim() } : m
    );
    saveCustomMessages(updated);

    toast.success(t.messageUpdated, {
      description: t.messageUpdatedDesc,
    });

    setNewMessageText("");
    setEditingMessage(null);
    setIsMessageDialogOpen(false);
  };

  const handleDeleteCustomMessage = (id: string) => {
    const messageToDelete = customMessages.find((m) => m.id === id);
    const updated = customMessages.filter((m) => m.id !== id);
    saveCustomMessages(updated);

    toast.success(t.messageDeleted, {
      description: t.messageDeletedDesc,
      action: {
        label: t.undo,
        onClick: () => {
          if (messageToDelete) {
            const restored = [...updated, messageToDelete];
            saveCustomMessages(restored);
          }
        },
      },
    });
  };

  const handleResetMessages = () => {
    const defaultMessages: CustomMessage[] = t.suggestions.map(
      (text, index) => ({
        id: `default-${index}`,
        text,
        isDefault: true,
      })
    );
    setCustomMessages(defaultMessages);
    localStorage.setItem("custom-messages", JSON.stringify(defaultMessages));
    setIsResetDialogOpen(false);
    toast.success(t.resetSuccess);
  };

  const openEditDialog = (message: CustomMessage) => {
    setEditingMessage(message);
    setNewMessageText(message.text);
    setIsMessageDialogOpen(true);
  };

  const closeDialog = () => {
    setIsMessageDialogOpen(false);
    setEditingMessage(null);
    setNewMessageText("");
  };

  const handleExportContacts = () => {
    if (savedContacts.length === 0) {
      toast.error(t.error, { description: t.noContactsFound });
      return;
    }
    const data = savedContacts.map((c) => ({
      Name: c.name,
      Phone: c.phone,
      CountryCode: c.countryCode || "",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Contacts");
    XLSX.writeFile(wb, "contacts.xlsx");
    toast.success(t.exportContacts, { description: t.importSuccess }); // Reusing importSuccess roughly or adds new key
  };

  const handleImportContacts = (imported: SavedContact[]) => {
    // 1. Remove duplicates within the imported file itself
    const uniqueImported = imported.filter(
      (v, i, a) =>
        a.findIndex(
          (t) => t.phone === v.phone && t.countryCode === v.countryCode
        ) === i
    );

    // 2. Filter out contacts that already exist in savedContacts
    const newContacts = uniqueImported.filter(
      (importedContact) =>
        !savedContacts.some(
          (saved) =>
            saved.phone === importedContact.phone &&
            saved.countryCode === importedContact.countryCode
        )
    );

    const addedCount = newContacts.length;
    const skippedCount = imported.length - addedCount;

    if (addedCount > 0) {
      const updated = [...savedContacts, ...newContacts];
      saveContactsToStorage(updated);
    }

    toast.success(t.importSuccess, {
      description: t.importSummary
        .replace("{added}", addedCount.toString())
        .replace("{skipped}", skippedCount.toString()),
    });
  };

  const renderSuggestedMessages = () => (
    <Card className="shadow-lg flex-1 flex flex-col overflow-hidden h-full border-0 md:border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle>{t.suggestedMessages}</CardTitle>
            <CardDescription>{t.suggestedMessagesDesc}</CardDescription>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsResetDialogOpen(true)}
              title={t.resetMessages}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Dialog
              open={isMessageDialogOpen}
              onOpenChange={setIsMessageDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon" // Changed to icon to match
                  onClick={() => {
                    setEditingMessage(null);
                    setNewMessageText("");
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingMessage ? t.editMessage : t.addMessage}
                  </DialogTitle>
                  <DialogDescription>{t.addMessageDesc}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder={t.messagePlaceholder}
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    rows={3}
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={closeDialog}>
                    {t.cancel}
                  </Button>
                  <Button
                    onClick={
                      editingMessage
                        ? handleEditCustomMessage
                        : handleAddCustomMessage
                    }
                  >
                    {editingMessage ? t.save : t.add}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-2 min-h-0">
        {customMessages.map((msg) => (
          <div key={msg.id} className="flex items-center gap-2">
            <Button
              variant="outline"
              className="flex-1 justify-start text-left h-auto py-3 px-4 bg-transparent text-wrap"
              onClick={() => handleSuggestedMessage(msg.text)}
            >
              <span className="text-sm">{msg.text}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openEditDialog(msg)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => handleDeleteCustomMessage(msg.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
      <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.resetConfirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.resetConfirmDesc}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetMessages}>
              {t.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );

  const renderContactsList = () => (
    <Card className="shadow-lg flex-1 flex flex-col overflow-hidden h-full border-0 md:border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookmarkCheck className="h-5 w-5" />
              {t.savedContacts}
            </CardTitle>
            <CardDescription>{t.savedContactsDesc}</CardDescription>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              title={t.importContacts}
              onClick={() => setIsImportOpen(true)}
            >
              <Upload className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title={t.exportContacts}
              onClick={handleExportContacts}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="pt-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t.searchContacts || "Search contacts..."}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto min-h-0">
        {filteredContacts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            {t.noContacts}
          </p>
        ) : (
          <div className="space-y-2">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <button
                  onClick={() => handleLoadContact(contact)}
                  className="flex-1 text-left"
                >
                  <p className="font-medium text-sm">{contact.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {contact.countryCode ? `${contact.countryCode} ` : ""}
                    {contact.phone}
                  </p>
                </button>
                <Button
                  onClick={() => handleDeleteContact(contact.id)}
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <ContactImporter
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={handleImportContacts}
        language={language}
      />
    </Card>
  );

  return (
    <div className="h-[100dvh] bg-background transition-colors flex flex-col overflow-hidden">
      {/* Navbar */}
      <div className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0 z-10">
        <div className="flex h-16 items-center px-6 justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 md:h-10 md:w-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <MessageSquare className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-foreground leading-tight">
                Direct Chat
              </h1>
              <p className="text-[10px] md:text-xs text-muted-foreground hidden sm:block">
                {t.subtitle}
              </p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="icon"
              className="text-foreground h-9 w-9"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button
              onClick={toggleLanguage}
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent h-9"
            >
              <Languages className="h-4 w-4" />
              <span className="hidden sm:inline">
                {language === "es" ? "Español" : "English"}
              </span>
              <span className="sm:hidden">
                {language === "es" ? "ES" : "EN"}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-4 md:px-6 flex-1 flex flex-col md:flex-row gap-6 min-h-0 py-4 md:py-6 relative">
        {/* Form Column */}
        <div className="flex flex-col flex-shrink-0 w-full md:w-1/2 overflow-hidden h-full">
          <div className="flex-1 overflow-y-auto pr-1">
            <Card className="shadow-lg h-full flex flex-col border-0 md:border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  {t.newChat}
                </CardTitle>
                <CardDescription>{t.newChatDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    {t.contactName} ({t.optional})
                  </Label>
                  <Input
                    id="name"
                    placeholder={t.contactNamePlaceholder}
                    value={contactName}
                    onChange={(e) => {
                      setContactName(e.target.value);
                      if (errors.name)
                        setErrors({ ...errors, name: undefined });
                    }}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">{t.country}</Label>
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger id="country" className="w-full">
                      <SelectValue className="truncate block" />
                    </SelectTrigger>
                    <SelectContent className="max-w-[calc(100vw-3rem)]">
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.dial}>
                          <div className="flex items-center gap-2 truncate max-w-[250px] sm:max-w-xs">
                            <span>{country.flag}</span>
                            <span className="truncate">{country.name}</span>
                            <span className="text-muted-foreground">
                              ({country.dial})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t.phoneNumber}</Label>
                  <div className="flex gap-2">
                    <div className="w-20 sm:w-24 px-2 sm:px-3 py-2 border rounded-md bg-muted text-muted-foreground text-sm flex items-center justify-center shrink-0">
                      {countryCode}
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder={
                        countries.find((c) => c.dial === countryCode)
                          ?.placeholder || "612345678"
                      }
                      value={phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        setPhone(value);
                        if (errors.phone)
                          setErrors({ ...errors, phone: undefined });
                      }}
                      className={`flex-1 min-w-0 ${
                        errors.phone ? "border-destructive" : ""
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">
                    {t.message} ({t.optional})
                  </Label>
                  <Textarea
                    id="message"
                    placeholder={t.messagePlaceholder}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (errors.message)
                        setErrors({ ...errors, message: undefined });
                    }}
                    rows={isMobile ? 2 : 4}
                    className={errors.message ? "border-destructive" : ""}
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive">{errors.message}</p>
                  )}
                </div>

                {!isMobile && (
                  <div className="space-y-3 pt-2">
                    <Label>{t.openWith}</Label>
                    <RadioGroup
                      value={openMethod}
                      onValueChange={(v) => setOpenMethod(v as "web" | "app")}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="web" id="r-web" />
                        <Label
                          htmlFor="r-web"
                          className="font-normal cursor-pointer flex items-center gap-2"
                        >
                          <Globe className="w-4 h-4" /> {t.whatsappWeb}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="app" id="r-app" />
                        <Label
                          htmlFor="r-app"
                          className="font-normal cursor-pointer flex items-center gap-2"
                        >
                          <Monitor className="w-4 h-4" /> {t.whatsappApp}
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button onClick={handleOpenChat} className="flex-1" size="lg">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {t.openWhatsApp}
                  </Button>
                  <div>
                    <Button
                      onClick={handleSaveContact}
                      variant="outline"
                      size="lg"
                      disabled={!contactName || !phone}
                      className={(() => {
                        const isDuplicate = savedContacts.some(
                          (c) =>
                            c.phone === phone && c.countryCode === countryCode
                        );
                        return isDuplicate
                          ? "opacity-50 cursor-not-allowed"
                          : "";
                      })()}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {t.save || "Save"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {isMobile && (
            <div className="grid grid-cols-2 gap-3 mt-3 flex-shrink-0 pt-2 bg-background">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full gap-2 h-12"
                    size="sm"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-xs">{t.viewMessages}</span>
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="h-[85vh]">
                  <DrawerHeader>
                    <DrawerTitle>{t.suggestedMessages}</DrawerTitle>
                    <DrawerDescription className="sr-only">
                      {t.suggestedMessagesDesc}
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="h-full overflow-hidden p-4 pt-0">
                    {renderSuggestedMessages()}
                  </div>
                </DrawerContent>
              </Drawer>

              <Drawer>
                <DrawerTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full gap-2 h-12"
                    size="sm"
                  >
                    <Users className="h-4 w-4" />
                    <span className="text-xs">{t.viewContacts}</span>
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="h-[85vh]">
                  <DrawerHeader>
                    <DrawerTitle>{t.savedContacts}</DrawerTitle>
                    <DrawerDescription className="sr-only">
                      {t.savedContactsDesc}
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="h-full overflow-hidden p-4 pt-0">
                    {renderContactsList()}
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          )}
        </div>

        {!isMobile && (
          <div className="space-y-6 flex-1 flex flex-col min-h-0 md:space-y-0 md:grid md:grid-rows-2 md:gap-6 h-full">
            <div className="flex-1 min-h-0">{renderSuggestedMessages()}</div>
            <div className="flex-1 min-h-0">{renderContactsList()}</div>
          </div>
        )}
      </div>
    </div>
  );
}
