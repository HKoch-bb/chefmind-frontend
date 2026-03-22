import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import {
  TextField, Button, Card, CardContent,
  Typography, Grid, Box, Chip,
  Dialog, DialogTitle, DialogContent,
  Drawer, List, ListItem, ListItemText, IconButton,
  Select, MenuItem, FormControl, InputLabel,
  Divider, CircularProgress, Tabs, Tab, Tooltip,
  LinearProgress, Slider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import LockIcon from "@mui/icons-material/Lock";
import BoltIcon from "@mui/icons-material/Bolt";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HomeIcon from "@mui/icons-material/Home";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import BarChartIcon from "@mui/icons-material/BarChart";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import MicIcon from "@mui/icons-material/Mic";
import MicNoneIcon from "@mui/icons-material/MicNone";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import StopIcon from "@mui/icons-material/Stop";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ─── Constants ────────────────────────────────────────────────────────────────
const UNITS = [
  { label: "—", value: "" },
  { label: "tsp", value: "tsp" }, { label: "tbsp", value: "tbsp" },
  { label: "cup", value: "cup" }, { label: "ml", value: "ml" },
  { label: "L", value: "L" }, { label: "fl oz", value: "fl oz" },
  { label: "g", value: "g" }, { label: "kg", value: "kg" },
  { label: "oz", value: "oz" }, { label: "lb", value: "lb" },
  { label: "piece(s)", value: "piece" }, { label: "slice(s)", value: "slice" },
  { label: "clove(s)", value: "clove" }, { label: "can(s)", value: "can" },
  { label: "bunch", value: "bunch" },
];

const FOOD_TYPES = [
  { emoji: "🍳", label: "Breakfast" }, { emoji: "🥗", label: "Salad" },
  { emoji: "🍜", label: "Soup" }, { emoji: "🫕", label: "Stew" },
  { emoji: "🌮", label: "Snack" }, { emoji: "🍛", label: "Main Course" },
  { emoji: "🥘", label: "Side Dish" }, { emoji: "🍰", label: "Dessert" },
  { emoji: "🥤", label: "Drink / Smoothie" }, { emoji: "🥙", label: "Sandwich / Wrap" },
  { emoji: "🍕", label: "Baked" }, { emoji: "🍱", label: "Rice Bowl" },
];

const DIET_OPTIONS = [
  { emoji: "🌱", label: "Vegetarian" }, { emoji: "🌿", label: "Vegan" },
  { emoji: "🌾", label: "Gluten-Free" }, { emoji: "🥛", label: "Dairy-Free" },
  { emoji: "🥩", label: "High-Protein" }, { emoji: "🔥", label: "Low-Carb" },
  { emoji: "⚡", label: "Keto" }, { emoji: "💪", label: "Low-Fat" },
  { emoji: "❤️", label: "Heart-Healthy" }, { emoji: "🧂", label: "Low-Sodium" },
];

const CUISINE_OPTIONS = [
  { emoji: "🍝", label: "Italian" }, { emoji: "🍛", label: "Indian" },
  { emoji: "🍣", label: "Japanese" }, { emoji: "🌮", label: "Mexican" },
  { emoji: "🫒", label: "Mediterranean" }, { emoji: "🥟", label: "Chinese" },
  { emoji: "🍜", label: "Thai" }, { emoji: "🥙", label: "Middle Eastern" },
  { emoji: "🥘", label: "Spanish" }, { emoji: "🍔", label: "American" },
  { emoji: "🥐", label: "French" }, { emoji: "🌍", label: "African" },
];

const DIFFICULTY_OPTIONS = [
  { emoji: "🟢", label: "Easy" },
  { emoji: "🟡", label: "Medium" },
  { emoji: "🔴", label: "Hard" },
];

// ─── Language Options ─────────────────────────────────────────────────────────
const LANGUAGES = [
  // Indian Regional
  { flag: "🇮🇳", label: "English",    value: "English",    group: "Indian" },
  { flag: "🇮🇳", label: "हिंदी",       value: "Hindi",      group: "Indian" },
  { flag: "🇮🇳", label: "தமிழ்",      value: "Tamil",      group: "Indian" },
  { flag: "🇮🇳", label: "తెలుగు",     value: "Telugu",     group: "Indian" },
  { flag: "🇮🇳", label: "ಕನ್ನಡ",      value: "Kannada",    group: "Indian" },
  { flag: "🇮🇳", label: "മലയാളം",    value: "Malayalam",  group: "Indian" },
  { flag: "🇮🇳", label: "मराठी",      value: "Marathi",    group: "Indian" },
  { flag: "🇮🇳", label: "বাংলা",      value: "Bengali",    group: "Indian" },
  { flag: "🇮🇳", label: "ਪੰਜਾਬੀ",     value: "Punjabi",    group: "Indian" },
  { flag: "🇮🇳", label: "ગુજરાતી",   value: "Gujarati",   group: "Indian" },
  { flag: "🇮🇳", label: "ଓଡ଼ିଆ",      value: "Odia",       group: "Indian" },
  { flag: "🇮🇳", label: "অসমীয়া",   value: "Assamese",   group: "Indian" },
  { flag: "🇮🇳", label: "اردو",       value: "Urdu",       group: "Indian" },
  // International
  { flag: "🇪🇸", label: "Español",    value: "Spanish",    group: "International" },
  { flag: "🇫🇷", label: "Français",   value: "French",     group: "International" },
  { flag: "🇩🇪", label: "Deutsch",    value: "German",     group: "International" },
  { flag: "🇮🇹", label: "Italiano",   value: "Italian",    group: "International" },
  { flag: "🇯🇵", label: "日本語",     value: "Japanese",   group: "International" },
  { flag: "🇨🇳", label: "中文",       value: "Chinese",    group: "International" },
  { flag: "🇸🇦", label: "العربية",    value: "Arabic",     group: "International" },
  { flag: "🇧🇷", label: "Português",  value: "Portuguese", group: "International" },
  { flag: "🇰🇷", label: "한국어",     value: "Korean",     group: "International" },
  { flag: "🇷🇺", label: "Русский",    value: "Russian",    group: "International" },
  { flag: "🇹🇷", label: "Türkçe",     value: "Turkish",    group: "International" },
];


const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const MEALS = ["Breakfast", "Lunch", "Dinner", "Snack"];

const DAY_COLORS = {
  Monday:    { bg: "#fff7ed", border: "#fed7aa", accent: "#f97316", text: "#c2410c" },
  Tuesday:   { bg: "#fdf4ff", border: "#e9d5ff", accent: "#a855f7", text: "#7e22ce" },
  Wednesday: { bg: "#eff6ff", border: "#bfdbfe", accent: "#3b82f6", text: "#1d4ed8" },
  Thursday:  { bg: "#f0fdf4", border: "#bbf7d0", accent: "#22c55e", text: "#15803d" },
  Friday:    { bg: "#fef2f2", border: "#fecaca", accent: "#ef4444", text: "#b91c1c" },
};

// ─── Toast System ─────────────────────────────────────────────────────────────
let _toastId = 0;
const ToastContainer = ({ toasts, removeToast }) => (
  <Box sx={{
    position: "fixed", bottom: 24, right: 24, zIndex: 9999,
    display: "flex", flexDirection: "column", gap: 1, pointerEvents: "none",
  }}>
    {toasts.map(t => (
      <Box key={t.id} sx={{
        pointerEvents: "auto",
        background: t.type === "error" ? "#1c1c1c" : t.type === "success" ? "#052e16" : "#1c1c1c",
        border: `1px solid ${t.type === "error" ? "#ef4444" : t.type === "success" ? "#22c55e" : "#374151"}`,
        borderRadius: 2, px: 2.5, py: 1.5,
        display: "flex", alignItems: "center", gap: 1.5,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        minWidth: 240, maxWidth: 380,
        animation: "slideIn 0.25s ease",
        "@keyframes slideIn": {
          from: { transform: "translateX(120%)", opacity: 0 },
          to: { transform: "translateX(0)", opacity: 1 },
        },
      }}>
        <Typography sx={{ fontSize: "1.1rem", flexShrink: 0 }}>
          {t.type === "error" ? "❌" : t.type === "success" ? "✅" : "ℹ️"}
        </Typography>
        <Typography sx={{ color: "#f9fafb", fontSize: "0.88rem", fontWeight: 500, flex: 1 }}>
          {t.message}
        </Typography>
        <IconButton size="small" onClick={() => removeToast(t.id)}
          sx={{ color: "#6b7280", p: 0.3, flexShrink: 0 }}>
          <CloseIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </Box>
    ))}
  </Box>
);

// ─── Mic Button (Voice Input) ─────────────────────────────────────────────────
const MicButton = ({ onResult, langCode = "en-US", size = 20 }) => {
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);

  const toggle = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Speech recognition not supported in this browser."); return; }
    if (listening) { recRef.current?.stop(); return; }

    const rec = new SR();
    rec.lang = langCode;
    rec.continuous = false;
    rec.interimResults = false;
    rec.onstart  = () => setListening(true);
    rec.onend    = () => setListening(false);
    rec.onerror  = () => setListening(false);
    rec.onresult = (e) => onResult(e.results[0][0].transcript);
    recRef.current = rec;
    rec.start();
  };

  return (
    <Tooltip title={listening ? "Stop listening" : "Speak ingredient name"} arrow>
      <IconButton onClick={toggle} size="small" sx={{
        color: listening ? "#ef4444" : "#9ca3af",
        animation: listening ? "micPulse 1s infinite" : "none",
        "@keyframes micPulse": { "0%,100%": { opacity: 1, transform: "scale(1)" }, "50%": { opacity: 0.5, transform: "scale(1.15)" } },
        "&:hover": { color: "#ef4444" },
      }}>
        {listening ? <MicIcon sx={{ fontSize: size }} /> : <MicNoneIcon sx={{ fontSize: size }} />}
      </IconButton>
    </Tooltip>
  );
};


// ─── Language Pill ────────────────────────────────────────────────────────────
const LanguagePill = ({ value, onChange, accentColor = "#ef4444", accentBg = "#fff5f5" }) => {
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find(l => l.value === value) || LANGUAGES[0];
  const groups = ["Indian", "International"];

  return (
    <Box sx={{ position: "relative" }}>
      {/* Trigger */}
      <Box
        onClick={() => setOpen(o => !o)}
        sx={{
          display: "inline-flex", alignItems: "center", gap: 0.8,
          px: 1.4, py: 0.6, borderRadius: "20px", cursor: "pointer",
          border: `1.5px solid ${open ? accentColor : "#e5e7eb"}`,
          background: open ? accentBg : "#fff",
          transition: "all 0.18s",
          "&:hover": { borderColor: accentColor, background: accentBg },
          userSelect: "none",
        }}
      >
        <Typography sx={{ fontSize: "1rem", lineHeight: 1 }}>{current.flag}</Typography>
        <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", maxWidth: 72, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {current.label}
        </Typography>
        <Typography sx={{ fontSize: "0.6rem", color: "#9ca3af", ml: 0.2 }}>▼</Typography>
      </Box>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <Box onClick={() => setOpen(false)} sx={{ position: "fixed", inset: 0, zIndex: 1299 }} />
          <Box sx={{
            position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 1300,
            background: "#fff", borderRadius: 2.5,
            border: "1px solid #e5e7eb",
            boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
            minWidth: 200, maxHeight: 360, overflowY: "auto",
            py: 1,
          }}>
            {groups.map(group => (
              <Box key={group}>
                <Typography sx={{
                  px: 2, py: 0.6, fontSize: "0.65rem", fontWeight: 800,
                  color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em",
                  borderBottom: "1px solid #f3f4f6", mb: 0.5,
                }}>
                  {group === "Indian" ? "🇮🇳 Indian Languages" : "🌍 International"}
                </Typography>
                {LANGUAGES.filter(l => l.group === group).map(lang => (
                  <Box
                    key={lang.value}
                    onClick={() => { onChange(lang.value); setOpen(false); }}
                    sx={{
                      display: "flex", alignItems: "center", gap: 1.2,
                      px: 2, py: 0.9, cursor: "pointer",
                      background: lang.value === value ? accentBg : "transparent",
                      "&:hover": { background: accentBg },
                      transition: "background 0.12s",
                    }}
                  >
                    <Typography sx={{ fontSize: "1rem", flexShrink: 0 }}>{lang.flag}</Typography>
                    <Typography sx={{
                      fontSize: "0.84rem",
                      fontWeight: lang.value === value ? 700 : 500,
                      color: lang.value === value ? accentColor : "#374151",
                    }}>
                      {lang.label}
                    </Typography>
                    {lang.value === value && (
                      <Typography sx={{ ml: "auto", fontSize: "0.7rem", color: accentColor }}>✓</Typography>
                    )}
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

// ─── Image Scan Button (Ingredient Detection from Photo) ──────────────────────
const ImageScanButton = ({ onConfirm, accentColor = "#f97316" }) => {
  const API = "http://localhost:5000";
  const fileRef = useRef();
  const [scanning, setScanning] = useState(false);
  const [preview, setPreview] = useState({ open: false, imageSrc: null, detected: [], description: "" });
  const [selected, setSelected] = useState([]);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = "";

    // Show the image immediately while we scan
    const imageSrc = URL.createObjectURL(file);
    setScanning(true);

    try {
      const base64 = await new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload  = () => res(reader.result.split(",")[1]);
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });

      const { data } = await axios.post(`${API}/identify-image`, {
        base64,
        mimeType: file.type,
      });

      const detected = data.ingredients || [];
      setSelected(detected.map((_, i) => i)); // all pre-selected
      setPreview({ open: true, imageSrc, detected, description: data.description || "" });
    } catch {
      alert("Could not scan image — please try again or use a clearer photo.");
    }
    setScanning(false);
  };

  const toggleItem = (i) =>
    setSelected(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  const confirm = () => {
    const chosen = preview.detected.filter((_, i) => selected.includes(i));
    onConfirm(chosen);
    setPreview(p => ({ ...p, open: false }));
    URL.revokeObjectURL(preview.imageSrc);
  };

  const cancel = () => {
    setPreview(p => ({ ...p, open: false }));
    URL.revokeObjectURL(preview.imageSrc);
  };

  return (
    <>
      {/* Hidden file input — accepts both gallery and camera on mobile */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={handleFile}
      />

      {/* Trigger button */}
      <Tooltip title="Scan photo to detect ingredients" arrow>
        <IconButton
          onClick={() => fileRef.current?.click()}
          disabled={scanning}
          size="small"
          sx={{
            color: scanning ? accentColor : "#9ca3af",
            "&:hover": { color: accentColor },
            animation: scanning ? "micPulse 1s infinite" : "none",
          }}
        >
          {scanning
            ? <CircularProgress size={18} sx={{ color: accentColor }} />
            : <CameraAltIcon sx={{ fontSize: 20 }} />}
        </IconButton>
      </Tooltip>

      {/* ── Confirmation dialog ── */}
      <Dialog
        open={preview.open}
        onClose={cancel}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
      >
        <DialogTitle sx={{
          background: "linear-gradient(135deg, #1a0a06, #3b1208)",
          color: "#fff", fontWeight: 800, fontSize: "1rem",
          display: "flex", alignItems: "center", justifyContent: "space-between", py: 2,
        }}>
          <Box display="flex" alignItems="center" gap={1}>
            <CameraAltIcon sx={{ fontSize: 20, color: "#f97316" }} />
            Detected Ingredients
          </Box>
          <IconButton onClick={cancel} size="small" sx={{ color: "rgba(255,255,255,0.5)" }}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {/* Scanned image thumbnail */}
          {preview.imageSrc && (
            <Box sx={{ position: "relative", height: 180, overflow: "hidden", background: "#000" }}>
              <Box
                component="img"
                src={preview.imageSrc}
                alt="scanned"
                sx={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.75 }}
              />
              {preview.description && (
                <Box sx={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                  px: 2, py: 1.5,
                }}>
                  <Typography sx={{ color: "#fff", fontSize: "0.82rem", fontStyle: "italic" }}>
                    {preview.description}
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          <Box p={2.5}>
            {preview.detected.length === 0 ? (
              <Box textAlign="center" py={3}>
                <Typography fontSize="2rem">🔍</Typography>
                <Typography fontWeight={600} color="#374151" mt={1}>No ingredients detected</Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  Try a clearer photo with better lighting.
                </Typography>
              </Box>
            ) : (
              <>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
                  <Typography fontWeight={700} color="#374151" fontSize="0.9rem">
                    {preview.detected.length} item{preview.detected.length !== 1 ? "s" : ""} found
                    <Box component="span" sx={{ ml: 1, color: "#9ca3af", fontWeight: 400, fontSize: "0.78rem" }}>
                      — untick any you don't want
                    </Box>
                  </Typography>
                  <Box display="flex" gap={0.8}>
                    <Button size="small" onClick={() => setSelected(preview.detected.map((_, i) => i))}
                      sx={{ fontSize: "0.72rem", color: accentColor }}>All</Button>
                    <Button size="small" onClick={() => setSelected([])}
                      sx={{ fontSize: "0.72rem", color: "#9ca3af" }}>None</Button>
                  </Box>
                </Box>

                <Box sx={{ maxHeight: 260, overflowY: "auto", display: "flex", flexDirection: "column", gap: 0.8 }}>
                  {preview.detected.map((item, i) => {
                    const checked = selected.includes(i);
                    return (
                      <Box
                        key={i}
                        onClick={() => toggleItem(i)}
                        sx={{
                          display: "flex", alignItems: "center", gap: 1.5,
                          px: 1.5, py: 1.2, borderRadius: 2, cursor: "pointer",
                          background: checked ? "#fff7ed" : "#f9fafb",
                          border: `1.5px solid ${checked ? accentColor : "#e5e7eb"}`,
                          transition: "all 0.15s",
                          "&:hover": { borderColor: accentColor, background: "#fff7ed" },
                        }}
                      >
                        {/* Checkbox */}
                        <Box sx={{
                          width: 20, height: 20, borderRadius: 1, flexShrink: 0,
                          border: `2px solid ${checked ? accentColor : "#d1d5db"}`,
                          background: checked ? accentColor : "#fff",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.15s",
                        }}>
                          {checked && <Typography sx={{ color: "#fff", fontSize: "0.72rem", fontWeight: 900, lineHeight: 1 }}>✓</Typography>}
                        </Box>

                        {/* Item name */}
                        <Typography fontSize="0.9rem" fontWeight={600} color="#374151" flex={1}>
                          {item.name}
                        </Typography>

                        {/* Detected qty + unit */}
                        {(item.qty || item.unit) && (
                          <Box sx={{
                            background: checked ? `${accentColor}22` : "#f3f4f6",
                            border: `1px solid ${checked ? accentColor : "#e5e7eb"}`,
                            borderRadius: 1.5, px: 1.2, py: 0.3,
                          }}>
                            <Typography fontSize="0.78rem" fontWeight={700}
                              color={checked ? accentColor : "#9ca3af"}>
                              {[item.qty, item.unit].filter(Boolean).join(" ")}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </Box>

                {/* Footer actions */}
                <Box display="flex" gap={1.5} mt={2.5}>
                  <Button
                    fullWidth variant="contained"
                    disabled={selected.length === 0}
                    onClick={confirm}
                    sx={{
                      background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                      borderRadius: 2, fontWeight: 700, py: 1.2,
                      boxShadow: `0 4px 14px ${accentColor}44`,
                    }}
                  >
                    Add {selected.length} ingredient{selected.length !== 1 ? "s" : ""}
                  </Button>
                  <Button fullWidth variant="outlined" onClick={cancel}
                    sx={{ borderRadius: 2, fontWeight: 600, borderColor: "#e5e7eb", color: "#6b7280" }}>
                    Cancel
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};


const shimmerSx = {
  background: "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s infinite",
  "@keyframes shimmer": {
    "0%": { backgroundPosition: "200% 0" },
    "100%": { backgroundPosition: "-200% 0" },
  },
};

const SkeletonCard = () => (
  <Card sx={{ borderRadius: 3, overflow: "hidden", border: "1px solid #f3f4f6" }}>
    <Box sx={{ height: 160, ...shimmerSx }} />
    <CardContent sx={{ p: 2 }}>
      <Box sx={{ height: 16, borderRadius: 1, mb: 1, width: "70%", ...shimmerSx }} />
      <Box sx={{ height: 12, borderRadius: 1, mb: 0.8, width: "90%", ...shimmerSx }} />
      <Box sx={{ height: 12, borderRadius: 1, width: "55%", ...shimmerSx }} />
    </CardContent>
  </Card>
);

// ─── Empty State Illustrations ────────────────────────────────────────────────
const EmptyStateIllustration = ({ type, message, subMessage, action }) => {
  const illustrations = {
    pantry: (
      <svg width="140" height="120" viewBox="0 0 140 120">
        <rect x="20" y="30" width="100" height="75" rx="8" fill="#fff7ed" stroke="#fed7aa" strokeWidth="2"/>
        <rect x="30" y="20" width="80" height="20" rx="4" fill="#f97316"/>
        <rect x="35" y="50" width="30" height="8" rx="3" fill="#fde68a"/>
        <rect x="75" y="50" width="30" height="8" rx="3" fill="#fde68a"/>
        <rect x="35" y="65" width="20" height="8" rx="3" fill="#fed7aa"/>
        <rect x="60" y="65" width="45" height="8" rx="3" fill="#fed7aa"/>
        <rect x="35" y="80" width="35" height="8" rx="3" fill="#fde68a"/>
        <circle cx="110" cy="28" r="14" fill="#ef4444"/>
        <text x="110" y="33" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">+</text>
      </svg>
    ),
    saved: (
      <svg width="140" height="120" viewBox="0 0 140 120">
        <rect x="25" y="15" width="90" height="95" rx="8" fill="#f0fdf4" stroke="#86efac" strokeWidth="2"/>
        <path d="M55 15 L55 60 L70 48 L85 60 L85 15" fill="#22c55e"/>
        <rect x="40" y="70" width="60" height="8" rx="3" fill="#bbf7d0"/>
        <rect x="40" y="83" width="40" height="6" rx="3" fill="#bbf7d0"/>
        <circle cx="110" cy="25" r="18" fill="#fff" stroke="#86efac" strokeWidth="2"/>
        <text x="110" y="31" textAnchor="middle" fill="#22c55e" fontSize="18">🍽️</text>
      </svg>
    ),
    search: (
      <svg width="140" height="120" viewBox="0 0 140 120">
        <circle cx="58" cy="52" r="32" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="2.5"/>
        <circle cx="58" cy="52" r="22" fill="#fff" stroke="#d1d5db" strokeWidth="1.5"/>
        <line x1="82" y1="76" x2="112" y2="106" stroke="#9ca3af" strokeWidth="5" strokeLinecap="round"/>
        <text x="58" y="57" textAnchor="middle" fill="#d1d5db" fontSize="18">?</text>
      </svg>
    ),
    plan: (
      <svg width="140" height="120" viewBox="0 0 140 120">
        <rect x="15" y="10" width="110" height="100" rx="8" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="2"/>
        <rect x="15" y="10" width="110" height="28" rx="8" fill="#3b82f6"/>
        <rect x="15" y="30" width="110" height="8" fill="#3b82f6"/>
        {[0,1,2,3].map(i => (
          <React.Fragment key={i}>
            <rect x="25" y={52 + i * 15} width="22" height="10" rx="3" fill="#bfdbfe"/>
            <rect x="55" y={52 + i * 15} width="22" height="10" rx="3" fill="#bfdbfe"/>
            <rect x="85" y={52 + i * 15} width="25" height="10" rx="3" fill="#bfdbfe"/>
          </React.Fragment>
        ))}
        <text x="70" y="30" textAnchor="middle" fill="white" fontSize="11" fontWeight="700">5-DAY PLAN</text>
      </svg>
    ),
  };

  return (
    <Box textAlign="center" py={8}>
      <Box display="flex" justifyContent="center" mb={2}>
        {illustrations[type] || illustrations.pantry}
      </Box>
      <Typography fontWeight={700} fontSize="1rem" color="#374151" mb={0.5}>{message}</Typography>
      {subMessage && (
        <Typography variant="body2" color="text.secondary" mb={action ? 2 : 0} maxWidth={320} mx="auto">
          {subMessage}
        </Typography>
      )}
      {action}
    </Box>
  );
};

// ─── Star Rating ──────────────────────────────────────────────────────────────
const StarRating = ({ value = 0, onChange, readOnly = false, size = 22 }) => (
  <Box display="flex" gap={0.3}>
    {[1, 2, 3, 4, 5].map(star => (
      <Box
        key={star}
        onClick={() => !readOnly && onChange && onChange(star === value ? 0 : star)}
        sx={{
          cursor: readOnly ? "default" : "pointer",
          color: star <= value ? "#f59e0b" : "#d1d5db",
          fontSize: size,
          transition: "color 0.15s, transform 0.1s",
          "&:hover": readOnly ? {} : { transform: "scale(1.2)", color: "#f59e0b" },
          display: "flex", alignItems: "center",
        }}
      >
        {star <= value ? <StarIcon sx={{ fontSize: size }} /> : <StarBorderIcon sx={{ fontSize: size }} />}
      </Box>
    ))}
  </Box>
);

// ─── FilterPill ───────────────────────────────────────────────────────────────
const FilterPill = ({ item, active, onClick }) => (
  <Box onClick={onClick} sx={{
    display: "inline-flex", alignItems: "center", gap: 0.6,
    px: 1.5, py: 0.7, borderRadius: "20px",
    fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", userSelect: "none",
    transition: "all 0.18s ease", border: "1.5px solid",
    borderColor: active ? "#ef4444" : "#e5e7eb",
    background: active ? "#fef2f2" : "#fff",
    color: active ? "#ef4444" : "#6b7280",
    "&:hover": { borderColor: "#ef4444", color: "#ef4444", background: "#fff5f5" },
  }}>
    <span style={{ fontSize: "1rem" }}>{item.emoji}</span>
    <span>{item.label}</span>
  </Box>
);

// ─── SectionHeader ────────────────────────────────────────────────────────────
const SectionHeader = ({ icon, title, subtitle, accent }) => (
  <Box mt={5} mb={2.5} p={2.5} sx={{
    background: accent === "lock"
      ? "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)"
      : "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
    borderRadius: 3,
    borderLeft: `4px solid ${accent === "lock" ? "#f97316" : "#22c55e"}`,
  }}>
    <Box display="flex" alignItems="center" gap={1}>
      {icon}
      <Typography variant="h6" fontWeight={800} color={accent === "lock" ? "#c2410c" : "#15803d"}>
        {title}
      </Typography>
    </Box>
    <Typography variant="body2" color="text.secondary" mt={0.3}>{subtitle}</Typography>
  </Box>
);

// ─── RecipeImage with Skeleton ────────────────────────────────────────────────
const imageMemCache = {};

const RecipeImage = ({ title, height = 160 }) => {
  const API = "http://localhost:5000";
  const [src, setSrc] = useState(null);
  const [imgLoading, setImgLoading] = useState(true);

  useEffect(() => {
    if (!title) { setImgLoading(false); return; }
    const key = title.toLowerCase();
    if (imageMemCache[key] !== undefined) {
      setSrc(imageMemCache[key]);
      setImgLoading(false);
      return;
    }
    let cancelled = false;
    fetch(`${API}/image?q=${encodeURIComponent(title)}`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        const url = data.url || null;
        imageMemCache[key] = url;
        setSrc(url);
        setImgLoading(false);
      })
      .catch(() => { if (!cancelled) setImgLoading(false); });
    return () => { cancelled = true; };
  }, [title]);

  if (imgLoading) return (
    <Box sx={{ width: "100%", height, ...shimmerSx }} />
  );

  if (!src) return (
    <Box sx={{
      width: "100%", height,
      background: "linear-gradient(135deg, #fff7ed, #fee2e2)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    }}>
      <Typography sx={{ fontSize: "2.2rem", mb: 0.5 }}>🍽️</Typography>
      <Typography variant="caption" color="text.secondary" fontSize="0.7rem" px={1} textAlign="center">
        {title?.substring(0, 28)}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ width: "100%", height, overflow: "hidden" }}>
      <img src={src} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    </Box>
  );
};

// ─── IngredientChips ──────────────────────────────────────────────────────────
const IngredientChips = ({ items, onRemove }) => (
  <Box mt={1.5} display="flex" flexWrap="wrap" gap={1}>
    {items.map((ing, idx) => (
      <Chip key={idx}
        label={[ing.qty, ing.unit, ing.name].filter(Boolean).join(" ")}
        onDelete={() => onRemove(idx)}
        deleteIcon={<CloseIcon sx={{ fontSize: "0.85rem !important" }} />}
        sx={{
          background: "#fff5f5", color: "#ef4444", border: "1px solid #fca5a5",
          fontWeight: 600, fontSize: "0.8rem",
          "& .MuiChip-deleteIcon": { color: "#f87171" },
        }}
      />
    ))}
  </Box>
);

// ─── MealPlanGrid ─────────────────────────────────────────────────────────────
const MealPlanGrid = ({ plan, onViewRecipe, recipeRatings = {}, onRate }) => {
  if (!plan || plan.length === 0) return null;
  return (
    <Box mt={3}>
      {plan.map((dayObj) => {
        const colors = DAY_COLORS[dayObj.day] || DAY_COLORS.Monday;
        return (
          <Box key={dayObj.day} mb={3} sx={{
            background: colors.bg, border: `1px solid ${colors.border}`,
            borderRadius: 3, overflow: "hidden",
          }}>
            <Box px={3} py={1.5} sx={{ background: colors.accent, display: "flex", alignItems: "center", gap: 1.5 }}>
              <CalendarMonthIcon sx={{ color: "#fff", fontSize: 20 }} />
              <Typography fontWeight={800} color="#fff" fontSize="1rem">{dayObj.day}</Typography>
            </Box>
            <Grid container spacing={0}>
              {MEALS.map((meal, mi) => {
                const entry = dayObj.meals?.[meal];
                const rating = entry?.name ? (recipeRatings[entry.name] || 0) : 0;
                return (
                  <Grid item xs={12} sm={6} md={3} key={meal}>
                    <Box sx={{
                      p: 2,
                      borderRight: mi < 3 ? `1px solid ${colors.border}` : "none",
                      borderBottom: { xs: `1px solid ${colors.border}`, md: "none" },
                      minHeight: 120,
                      display: "flex", flexDirection: "column",
                    }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: colors.accent, textTransform: "uppercase", letterSpacing: "0.07em", fontSize: "0.65rem" }}>
                        {meal}
                      </Typography>
                      {entry?.name ? (
                        <>
                          <Box
                            onClick={() => onViewRecipe(entry.name)}
                            sx={{ cursor: "pointer", flex: 1, "&:hover .view-link": { opacity: 1 } }}
                          >
                            <Typography fontWeight={700} fontSize="0.88rem" color="#1a1a1a" mt={0.5} lineHeight={1.3}>
                              {entry.name}
                            </Typography>
                            {entry.note && (
                              <Typography variant="caption" color="text.secondary" fontSize="0.75rem">
                                {entry.note}
                              </Typography>
                            )}
                            <Typography className="view-link" variant="caption" sx={{ color: colors.accent, fontWeight: 600, fontSize: "0.72rem", display: "block", mt: 0.3, opacity: 0.7, transition: "opacity 0.15s" }}>
                              View recipe →
                            </Typography>
                          </Box>
                          {/* Inline star rating */}
                          <Box mt={0.8} onClick={e => e.stopPropagation()}>
                            <StarRating
                              value={rating}
                              onChange={onRate ? (v) => onRate(entry.name, v) : undefined}
                              size={14}
                            />
                          </Box>
                        </>
                      ) : (
                        <Typography color="text.disabled" fontSize="0.8rem" mt={0.5}>—</Typography>
                      )}
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        );
      })}
    </Box>
  );
};

// ─── FiltersPanel (with Cuisine) ──────────────────────────────────────────────
const FiltersPanel = ({
  activeFoodTypes, setActiveFoodTypes,
  activeDiet, setActiveDiet,
  activeDifficulty, setActiveDifficulty,
  activeCuisine, setActiveCuisine,
  subtitle,
}) => {
  const [open, setOpen] = useState(false);
  const total = activeFoodTypes.length + activeDiet.length + (activeDifficulty ? 1 : 0) + (activeCuisine || []).length;
  const toggle = (arr, setArr, val) =>
    setArr(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

  return (
    <Box sx={{ background: "#fff", borderRadius: 3, border: "1px solid #f3f4f6", overflow: "hidden", mb: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between"
        px={3} py={2} sx={{ cursor: "pointer", "&:hover": { background: "#fafafa" } }}
        onClick={() => setOpen(!open)}>
        <Box display="flex" alignItems="center" gap={1.2}>
          <TuneIcon sx={{ color: "#ef4444", fontSize: 20 }} />
          <Typography fontWeight={700} color="#374151">Filters</Typography>
          {total > 0 && (
            <Box sx={{
              background: "#ef4444", color: "#fff", borderRadius: "12px",
              px: 1, py: 0.1, fontSize: "0.7rem", fontWeight: 800, minWidth: 22, textAlign: "center",
            }}>{total}</Box>
          )}
        </Box>
        <Typography variant="caption" color="text.secondary">
          {open ? "▲ Hide" : "▼ Show"} · {subtitle}
        </Typography>
      </Box>

      {open && (
        <Box px={3} pb={3}>
          <Divider sx={{ mb: 2.5 }} />

          <Typography variant="overline" sx={{ fontWeight: 800, color: "#6b7280", letterSpacing: "0.08em", fontSize: "0.68rem" }}>
            🌍 Cuisine
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1} mt={1} mb={3}>
            {CUISINE_OPTIONS.map(c => (
              <FilterPill key={c.label} item={c}
                active={(activeCuisine || []).includes(c.label)}
                onClick={() => toggle(activeCuisine || [], setActiveCuisine, c.label)}
              />
            ))}
          </Box>

          <Typography variant="overline" sx={{ fontWeight: 800, color: "#6b7280", letterSpacing: "0.08em", fontSize: "0.68rem" }}>
            🍽️ Food Type
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1} mt={1} mb={3}>
            {FOOD_TYPES.map(f => (
              <FilterPill key={f.label} item={f}
                active={activeFoodTypes.includes(f.label)}
                onClick={() => toggle(activeFoodTypes, setActiveFoodTypes, f.label)}
              />
            ))}
          </Box>

          <Typography variant="overline" sx={{ fontWeight: 800, color: "#6b7280", letterSpacing: "0.08em", fontSize: "0.68rem" }}>
            🥦 Dietary Preferences
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
            {DIET_OPTIONS.map(d => (
              <FilterPill key={d.label} item={d}
                active={activeDiet.includes(d.label)}
                onClick={() => toggle(activeDiet, setActiveDiet, d.label)}
              />
            ))}
          </Box>

          <Box mt={3}>
            <Typography variant="overline" sx={{ fontWeight: 800, color: "#6b7280", letterSpacing: "0.08em", fontSize: "0.68rem" }}>
              🎯 Difficulty Level
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
              {DIFFICULTY_OPTIONS.map(d => (
                <FilterPill key={d.label} item={d}
                  active={activeDifficulty === d.label}
                  onClick={() => setActiveDifficulty(prev => prev === d.label ? null : d.label)}
                />
              ))}
            </Box>
          </Box>

          {total > 0 && (
            <Box mt={2}>
              <Button size="small" onClick={() => {
                setActiveFoodTypes([]); setActiveDiet([]); setActiveDifficulty(null);
                if (setActiveCuisine) setActiveCuisine([]);
              }} sx={{ color: "#9ca3af", fontSize: "0.75rem" }}>
                ✕ Clear all filters
              </Button>
            </Box>
          )}
        </Box>
      )}

      {total > 0 && (
        <Box px={3} pb={2} display="flex" flexWrap="wrap" gap={0.8} alignItems="center">
          <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>Active:</Typography>
          {[...(activeCuisine || []), ...activeFoodTypes, ...activeDiet, ...(activeDifficulty ? [activeDifficulty] : [])].map(f => (
            <Chip key={f} label={f} size="small" sx={{
              background: "#fef2f2", color: "#ef4444", border: "1px solid #fca5a5",
              fontWeight: 600, fontSize: "0.72rem", height: 22,
            }} />
          ))}
        </Box>
      )}
    </Box>
  );
};

// ─── Cook Mode ────────────────────────────────────────────────────────────────
const CookMode = ({ open, recipe, onClose, language = "English" }) => {
  const LANG_MAP = {
    English: "en-US", Hindi: "hi-IN", Tamil: "ta-IN", Telugu: "te-IN",
    Kannada: "kn-IN", Malayalam: "ml-IN", Marathi: "mr-IN", Bengali: "bn-IN",
    Punjabi: "pa-IN", Gujarati: "gu-IN", Odia: "or-IN", Assamese: "as-IN",
    Urdu: "ur-PK", Spanish: "es-ES", French: "fr-FR", German: "de-DE",
    Italian: "it-IT", Japanese: "ja-JP", Chinese: "zh-CN", Arabic: "ar-SA",
    Portuguese: "pt-BR", Korean: "ko-KR", Russian: "ru-RU", Turkish: "tr-TR",
  };
  const langCode = LANG_MAP[language] || "en-US";

  const [step, setStep] = useState(0);
  const [timer, setTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [autoRead, setAutoRead] = useState(false);
  const intervalRef = useRef(null);

  const steps = recipe?.steps || [];
  const current = steps[step];
  const stepText = typeof current === "string" ? current : current?.text || "";
  const stepTime = current?.time_min ? current.time_min * 60 : null;

  useEffect(() => {
    setStep(0);
    setRunning(false);
    setTimeLeft(0);
    clearInterval(intervalRef.current);
  }, [open, recipe]);

  useEffect(() => {
    if (stepTime) setTimeLeft(stepTime);
    setRunning(false);
    clearInterval(intervalRef.current);
  }, [step]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(intervalRef.current); setRunning(false); return 0; }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const speakStep = useCallback((text) => {
    if (!window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = langCode;
    utt.rate = 1;
    window.speechSynthesis.speak(utt);
  }, [langCode]);

  // Auto-read when step changes (if enabled)
  useEffect(() => {
    if (autoRead && stepText) speakStep(`Step ${step + 1}. ${stepText}`);
  }, [step, autoRead]);

  // Stop reading when cook mode closes
  useEffect(() => {
    if (!open) window.speechSynthesis?.cancel();
  }, [open]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60), sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (!open || !recipe) return null;

  return (
    <Dialog open={open} onClose={onClose} fullScreen
      PaperProps={{ sx: { background: "#0f0a08" } }}>
      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <Box sx={{ px: 4, py: 2.5, background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography sx={{ color: "#f97316", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Cook Mode · {recipe._title || "Recipe"}
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>
              Step {step + 1} of {steps.length}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1.5}>
            {/* Manual read step button */}
            <Tooltip title="Read this step aloud" arrow>
              <IconButton onClick={() => speakStep(`Step ${step + 1}. ${stepText}`)}
                size="small"
                sx={{ color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 1.5, "&:hover": { color: "#f97316", borderColor: "rgba(249,115,22,0.4)" } }}>
                <VolumeUpIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            {/* Auto-read toggle */}
            <Tooltip title={autoRead ? "Auto-read ON — tap to disable" : "Auto-read OFF — tap to enable"} arrow>
              <Box onClick={() => { setAutoRead(a => !a); window.speechSynthesis?.cancel(); }}
                sx={{
                  display: "flex", alignItems: "center", gap: 0.8,
                  px: 1.4, py: 0.6, borderRadius: 2, cursor: "pointer",
                  background: autoRead ? "rgba(249,115,22,0.2)" : "rgba(255,255,255,0.06)",
                  border: `1px solid ${autoRead ? "rgba(249,115,22,0.5)" : "rgba(255,255,255,0.1)"}`,
                  transition: "all 0.2s",
                }}>
                <GraphicEqIcon sx={{ fontSize: 14, color: autoRead ? "#f97316" : "rgba(255,255,255,0.3)" }} />
                <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: autoRead ? "#fdba74" : "rgba(255,255,255,0.3)" }}>
                  {autoRead ? "Auto-read ON" : "Auto-read"}
                </Typography>
              </Box>
            </Tooltip>
            <IconButton onClick={onClose} sx={{ color: "rgba(255,255,255,0.4)", "&:hover": { color: "#fff" } }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Progress bar */}
        <LinearProgress
          variant="determinate"
          value={((step + 1) / steps.length) * 100}
          sx={{
            height: 3, background: "rgba(255,255,255,0.08)",
            "& .MuiLinearProgress-bar": { background: "linear-gradient(90deg, #f97316, #ef4444)" },
          }}
        />

        {/* Main content */}
        <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>

          {/* Step display */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: { xs: 4, md: 8 } }}>
            <Box sx={{
              width: 60, height: 60, borderRadius: "50%",
              background: "linear-gradient(135deg, #f97316, #ef4444)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.4rem", fontWeight: 900, color: "#fff", mb: 4,
              boxShadow: "0 0 32px rgba(239,68,68,0.4)",
            }}>
              {step + 1}
            </Box>

            <Typography sx={{
              color: "#fff", fontSize: { xs: "1.2rem", md: "1.6rem" },
              fontWeight: 500, lineHeight: 1.7, textAlign: "center",
              maxWidth: 680,
            }}>
              {stepText}
            </Typography>

            {/* Timer */}
            {stepTime && (
              <Box mt={5} textAlign="center">
                <Typography sx={{
                  color: running ? "#f97316" : (timeLeft === 0 && stepTime ? "#22c55e" : "rgba(255,255,255,0.5)"),
                  fontSize: "3rem", fontWeight: 900, letterSpacing: "0.05em",
                  fontVariantNumeric: "tabular-nums",
                }}>
                  {formatTime(timeLeft)}
                </Typography>
                <Box display="flex" gap={1.5} justifyContent="center" mt={2}>
                  <Button
                    variant="contained"
                    onClick={() => setRunning(r => !r)}
                    startIcon={running ? <PauseIcon /> : <PlayArrowIcon />}
                    sx={{
                      background: running ? "rgba(239,68,68,0.2)" : "linear-gradient(135deg, #f97316, #ef4444)",
                      border: running ? "1px solid rgba(239,68,68,0.5)" : "none",
                      borderRadius: 2, fontWeight: 700,
                    }}>
                    {running ? "Pause" : timeLeft === 0 ? "Restart" : "Start Timer"}
                  </Button>
                  {timeLeft < stepTime && (
                    <Button onClick={() => { setTimeLeft(stepTime); setRunning(false); }}
                      sx={{ color: "rgba(255,255,255,0.4)", borderRadius: 2 }}>
                      Reset
                    </Button>
                  )}
                </Box>
              </Box>
            )}
          </Box>

          {/* Ingredients sidebar */}
          <Box sx={{
            width: { xs: 0, lg: 280 }, overflow: "hidden", display: { xs: "none", lg: "flex" },
            flexDirection: "column",
            background: "rgba(255,255,255,0.03)", borderLeft: "1px solid rgba(255,255,255,0.07)",
            p: 3,
          }}>
            <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", mb: 2 }}>
              Ingredients
            </Typography>
            {recipe.ingredients?.main?.map((ing, i) => (
              <Box key={i} sx={{ mb: 1.5, pb: 1.5, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <Typography sx={{ color: "#fff", fontSize: "0.85rem", fontWeight: 600 }}>{ing.name}</Typography>
                <Typography sx={{ color: "#f97316", fontSize: "0.78rem" }}>{ing.quantity}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Navigation */}
        <Box sx={{ px: 4, py: 3, background: "rgba(255,255,255,0.04)", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Button
            disabled={step === 0}
            onClick={() => setStep(s => s - 1)}
            startIcon={<ChevronLeftIcon />}
            sx={{ color: step === 0 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.6)", fontWeight: 600 }}>
            Previous
          </Button>

          {/* Step dots */}
          <Box display="flex" gap={0.8}>
            {steps.map((_, i) => (
              <Box key={i} onClick={() => setStep(i)} sx={{
                width: i === step ? 20 : 8, height: 8, borderRadius: "4px",
                background: i === step ? "#f97316" : i < step ? "#f9731650" : "rgba(255,255,255,0.12)",
                cursor: "pointer", transition: "all 0.2s ease",
              }} />
            ))}
          </Box>

          {step < steps.length - 1 ? (
            <Button
              onClick={() => setStep(s => s + 1)}
              endIcon={<ChevronRightIcon />}
              sx={{
                background: "linear-gradient(135deg, #f97316, #ef4444)",
                color: "#fff", fontWeight: 700, borderRadius: 2, px: 3,
              }}>
              Next Step
            </Button>
          ) : (
            <Button onClick={onClose} sx={{
              background: "#22c55e", color: "#fff", fontWeight: 700, borderRadius: 2, px: 3,
            }}>
              🎉 Done!
            </Button>
          )}
        </Box>
      </Box>
    </Dialog>
  );
};

// ─── Shopping List Modal ──────────────────────────────────────────────────────
const CATEGORY_RULES = {
  "🥩 Meat & Protein": ["chicken", "beef", "pork", "lamb", "turkey", "fish", "salmon", "tuna", "shrimp", "tofu", "tempeh", "bacon", "sausage", "egg", "eggs"],
  "🥦 Produce": ["lettuce", "spinach", "kale", "onion", "garlic", "tomato", "carrot", "broccoli", "pepper", "celery", "zucchini", "cucumber", "potato", "sweet potato", "lemon", "lime", "avocado", "mushroom", "ginger", "herb", "basil", "cilantro", "parsley", "apple", "banana", "berry"],
  "🥛 Dairy": ["milk", "cheese", "butter", "cream", "yogurt", "parmesan", "mozzarella", "feta", "ricotta", "sour cream", "heavy cream"],
  "🌾 Grains & Pasta": ["flour", "rice", "pasta", "noodle", "bread", "oat", "quinoa", "barley", "cornmeal", "tortilla", "panko", "breadcrumb"],
  "🥫 Pantry": ["oil", "vinegar", "soy sauce", "tomato paste", "coconut milk", "broth", "stock", "can", "bean", "lentil", "chickpea", "sugar", "honey", "salt", "pepper", "cumin", "paprika", "turmeric", "cinnamon", "oregano", "thyme"],
};

function categorizeIngredient(name) {
  const n = name.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_RULES)) {
    if (keywords.some(k => n.includes(k))) return cat;
  }
  return "📦 Other";
}

const ShoppingListModal = ({ open, onClose, items, title }) => {
  const [checked, setChecked] = useState({});

  const grouped = {};
  items.forEach(item => {
    const cat = categorizeIngredient(item.name || item);
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(item);
  });

  const allText = Object.entries(grouped).map(([cat, its]) =>
    `${cat}\n${its.map(i => `  - ${typeof i === "string" ? i : [i.qty, i.unit, i.name].filter(Boolean).join(" ")}`).join("\n")}`
  ).join("\n\n");

  const toggleCheck = (key) => setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  const totalItems = items.length;
  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: 3, maxHeight: "85vh" } }}>
      <DialogTitle sx={{
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        color: "#fff", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <ShoppingCartIcon sx={{ color: "#f97316" }} />
          <Box>
            <Typography fontWeight={800} color="#fff">{title || "Shopping List"}</Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>
              {checkedCount}/{totalItems} items checked
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "rgba(255,255,255,0.5)" }}><CloseIcon /></IconButton>
      </DialogTitle>

      <LinearProgress
        variant="determinate"
        value={totalItems ? (checkedCount / totalItems) * 100 : 0}
        sx={{
          height: 4, background: "#f3f4f6",
          "& .MuiLinearProgress-bar": { background: "linear-gradient(90deg, #f97316, #22c55e)" },
        }}
      />

      <DialogContent sx={{ p: 0 }}>
        {Object.entries(grouped).map(([cat, its]) => (
          <Box key={cat}>
            <Box px={3} py={1.5} sx={{ background: "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
              <Typography fontWeight={800} fontSize="0.8rem" color="#374151">{cat}</Typography>
            </Box>
            {its.map((item, i) => {
              const label = typeof item === "string" ? item : [item.qty, item.unit, item.name].filter(Boolean).join(" ");
              const key = `${cat}:${i}`;
              return (
                <Box key={i} onClick={() => toggleCheck(key)} sx={{
                  px: 3, py: 1.5, display: "flex", alignItems: "center", gap: 2,
                  cursor: "pointer", borderBottom: "1px solid #f9fafb",
                  "&:hover": { background: "#fafafa" },
                  opacity: checked[key] ? 0.45 : 1,
                  transition: "opacity 0.15s",
                }}>
                  {checked[key]
                    ? <CheckBoxIcon sx={{ color: "#22c55e", fontSize: 20 }} />
                    : <CheckBoxOutlineBlankIcon sx={{ color: "#d1d5db", fontSize: 20 }} />
                  }
                  <Typography fontSize="0.9rem" color="#374151"
                    sx={{ textDecoration: checked[key] ? "line-through" : "none" }}>
                    {label}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        ))}
      </DialogContent>

      <Box px={3} py={2} sx={{ borderTop: "1px solid #f3f4f6", display: "flex", gap: 1.5 }}>
        <Button startIcon={<ContentCopyIcon />} variant="outlined" size="small"
          onClick={() => { navigator.clipboard.writeText(allText); }}
          sx={{ borderColor: "#e5e7eb", color: "#374151", borderRadius: 2, fontSize: "0.8rem" }}>
          Copy List
        </Button>
        <Button startIcon={<PrintIcon />} variant="outlined" size="small"
          onClick={() => { const w = window.open(); w.document.write(`<pre style="font-family:sans-serif;font-size:14px;padding:24px">${allText}</pre>`); w.print(); }}
          sx={{ borderColor: "#e5e7eb", color: "#374151", borderRadius: 2, fontSize: "0.8rem" }}>
          Print
        </Button>
        <Button size="small" onClick={() => setChecked({})}
          sx={{ ml: "auto", color: "#9ca3af", fontSize: "0.8rem" }}>
          Uncheck All
        </Button>
      </Box>
    </Dialog>
  );
};

// ─── Substitution Modal ───────────────────────────────────────────────────────
const SubstitutionModal = ({ open, ingredient, recipeName, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const API = "http://localhost:5000";

  useEffect(() => {
    if (!open || !ingredient) return;
    setLoading(true); setResults([]); setError(null);
    axios.post(`${API}/ingredient-sub`, { ingredient, recipeName })
      .then(r => setResults(r.data.substitutions || []))
      .catch(() => setError("Failed to load substitutions"))
      .finally(() => setLoading(false));
  }, [open, ingredient, recipeName]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{
        background: "linear-gradient(135deg, #fff7ed, #fef2f2)",
        borderBottom: "1px solid #f3f4f6", fontWeight: 800,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Box display="flex" alignItems="center" gap={1}>
          <SwapHorizIcon sx={{ color: "#f97316" }} />
          <Typography fontWeight={800}>Substitute: {ingredient}</Typography>
        </Box>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {loading && (
          <Box display="flex" alignItems="center" gap={2} py={3}>
            <CircularProgress size={20} sx={{ color: "#f97316" }} />
            <Typography color="text.secondary">Finding smart swaps…</Typography>
          </Box>
        )}
        {error && <Typography color="error">{error}</Typography>}
        {results.map((sub, i) => (
          <Box key={i} mb={2} p={2} sx={{ background: "#fff7ed", borderRadius: 2, border: "1px solid #fed7aa" }}>
            <Typography fontWeight={800} color="#c2410c" mb={0.3}>{sub.name}</Typography>
            {sub.ratio && <Typography variant="caption" sx={{ color: "#f97316", fontWeight: 700, display: "block", mb: 0.3 }}>Amount: {sub.ratio}</Typography>}
            <Typography fontSize="0.85rem" color="#374151">{sub.note}</Typography>
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
};

// ─── Nutrition Dashboard ──────────────────────────────────────────────────────
const NutritionDashboard = ({ plan }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const API = "http://localhost:5000";

  const mealNames = React.useMemo(() => {
    if (!plan) return [];
    const names = [];
    plan.forEach(d => Object.values(d.meals).forEach(m => { if (m.name) names.push(m.name); }));
    return [...new Set(names)];
  }, [plan]);

  const analyze = async () => {
    setLoading(true); setData(null); setOpen(true);
    try {
      const res = await axios.post(`${API}/nutrition-summary`, { mealNames });
      const meals = res.data.meals || [];
      const totals = meals.reduce((acc, m) => ({
        calories: acc.calories + (m.calories || 0),
        protein: acc.protein + (m.protein_g || 0),
        carbs: acc.carbs + (m.carbs_g || 0),
        fat: acc.fat + (m.fat_g || 0),
      }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
      setData({ meals, totals });
    } catch { setData(null); }
    setLoading(false);
  };

  if (!plan || plan.length === 0) return null;

  return (
    <>
      <Box mt={3} p={2.5} sx={{ background: "linear-gradient(135deg, #0f172a, #1e293b)", borderRadius: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <BarChartIcon sx={{ color: "#f97316" }} />
            <Box>
              <Typography fontWeight={800} color="#fff" fontSize="0.95rem">Weekly Nutrition Estimate</Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>
                {mealNames.length} unique meals across the plan
              </Typography>
            </Box>
          </Box>
          <Button variant="contained" size="small" onClick={analyze} disabled={loading}
            sx={{ background: "linear-gradient(135deg, #f97316, #ef4444)", borderRadius: 2, fontWeight: 700 }}>
            {loading ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : "📊 Analyze"}
          </Button>
        </Box>

        {data && (
          <Box mt={3}>
            <Grid container spacing={2} mb={2}>
              {[
                { label: "Total Calories", val: `${data.totals.calories.toLocaleString()} kcal`, color: "#f97316", bg: "rgba(249,115,22,0.15)" },
                { label: "Total Protein", val: `${data.totals.protein}g`, color: "#22c55e", bg: "rgba(34,197,94,0.15)" },
                { label: "Total Carbs", val: `${data.totals.carbs}g`, color: "#3b82f6", bg: "rgba(59,130,246,0.15)" },
                { label: "Total Fat", val: `${data.totals.fat}g`, color: "#a855f7", bg: "rgba(168,85,247,0.15)" },
              ].map((n, i) => (
                <Grid item xs={6} sm={3} key={i}>
                  <Box sx={{ background: n.bg, borderRadius: 2, p: 1.5, textAlign: "center" }}>
                    <Typography fontWeight={900} color={n.color} fontSize="1.1rem">{n.val}</Typography>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>{n.label}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Typography sx={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem" }}>
              * Estimates based on typical serving sizes. Actual values may vary.
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
};

// ─── Onboarding Flow ──────────────────────────────────────────────────────────
const ONBOARDING_STEPS = [
  {
    title: "Welcome to ChefMind! 👋",
    desc: "Let's take a quick tour to get you cooking smarter. Takes about 20 seconds.",
    icon: "🍳",
    highlight: null,
  },
  {
    title: "Add Ingredients",
    desc: "Type what's in your fridge with quantity and unit, then hit Generate Recipes to see what you can cook!",
    icon: "📦",
    highlight: "recipes",
  },
  {
    title: "Save & Rate Recipes",
    desc: "Star any recipe you love and leave personal notes. Access everything in Saved Recipes.",
    icon: "⭐",
    highlight: "saved",
  },
  {
    title: "Plan Your Week",
    desc: "Head to Meal Planner to auto-generate a full 5-day plan. You can even build a shopping list from it!",
    icon: "📅",
    highlight: "planner",
  },
];

const OnboardingFlow = ({ onFinish, setPage }) => {
  const [step, setStep] = useState(0);
  const current = ONBOARDING_STEPS[step];
  const isLast = step === ONBOARDING_STEPS.length - 1;

  return (
    <Box sx={{
      position: "fixed", inset: 0, zIndex: 9998,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <Box sx={{
        background: "#fff", borderRadius: 4, p: 4, maxWidth: 420, width: "90%",
        boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
        animation: "popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        "@keyframes popIn": {
          from: { transform: "scale(0.8)", opacity: 0 },
          to: { transform: "scale(1)", opacity: 1 },
        },
      }}>
        {/* Progress dots */}
        <Box display="flex" gap={0.7} mb={3}>
          {ONBOARDING_STEPS.map((_, i) => (
            <Box key={i} sx={{
              height: 4, flex: 1, borderRadius: "2px",
              background: i <= step ? "linear-gradient(90deg,#f97316,#ef4444)" : "#e5e7eb",
              transition: "background 0.3s",
            }} />
          ))}
        </Box>

        <Typography fontSize="2.5rem" mb={1.5}>{current.icon}</Typography>
        <Typography fontWeight={900} fontSize="1.25rem" color="#1a1a1a" mb={1}>{current.title}</Typography>
        <Typography color="#6b7280" lineHeight={1.7} mb={3}>{current.desc}</Typography>

        <Box display="flex" gap={1.5}>
          <Button onClick={onFinish} sx={{ color: "#9ca3af", fontSize: "0.82rem" }}>
            Skip tour
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (current.highlight) setPage(current.highlight);
              if (isLast) { onFinish(); } else setStep(s => s + 1);
            }}
            sx={{
              background: "linear-gradient(135deg, #ef4444, #f97316)",
              borderRadius: 2, fontWeight: 700, flex: 1,
              boxShadow: "0 4px 16px rgba(239,68,68,0.3)",
            }}>
            {isLast ? "Let's cook! 🚀" : "Next →"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

// ─── Recipe Audio Player ──────────────────────────────────────────────────────
const RecipeAudioPlayer = ({ recipe, language = "English" }) => {
  const LANGUAGES_MAP = {
    English: "en-US", Hindi: "hi-IN", Tamil: "ta-IN", Telugu: "te-IN",
    Kannada: "kn-IN", Malayalam: "ml-IN", Marathi: "mr-IN", Bengali: "bn-IN",
    Punjabi: "pa-IN", Gujarati: "gu-IN", Odia: "or-IN", Assamese: "as-IN",
    Urdu: "ur-PK", Spanish: "es-ES", French: "fr-FR", German: "de-DE",
    Italian: "it-IT", Japanese: "ja-JP", Chinese: "zh-CN", Arabic: "ar-SA",
    Portuguese: "pt-BR", Korean: "ko-KR", Russian: "ru-RU", Turkish: "tr-TR",
  };
  const langCode = LANGUAGES_MAP[language] || "en-US";

  // Build segments: each segment is a text chunk with a label
  const buildSegments = () => {
    if (!recipe) return [];
    const segs = [];
    const title = recipe._title || recipe.title || "Recipe";
    segs.push({ label: "Title", text: title, type: "title" });
    if (recipe.servings || recipe.prep_time || recipe.cook_time) {
      const meta = [
        recipe.servings && `Serves ${recipe.servings}`,
        recipe.prep_time && `Preparation time: ${recipe.prep_time}`,
        recipe.cook_time && `Cooking time: ${recipe.cook_time}`,
      ].filter(Boolean).join(". ");
      segs.push({ label: "Details", text: meta, type: "meta" });
    }
    if (recipe.overview) {
      segs.push({ label: "Overview", text: recipe.overview, type: "overview" });
    }
    if (recipe.ingredients?.main?.length) {
      segs.push({ label: "Ingredients", text: "Here are the ingredients you will need.", type: "section" });
      recipe.ingredients.main.forEach((ing, i) => {
        segs.push({
          label: `Ingredient ${i + 1}`,
          text: `${ing.quantity || ""} ${ing.name}`.trim(),
          type: "ingredient",
          index: i,
        });
      });
    }
    if (recipe.steps?.length) {
      segs.push({ label: "Steps", text: "Now let's start cooking. Follow these steps.", type: "section" });
      recipe.steps.forEach((s, i) => {
        const text = typeof s === "string" ? s : s.text;
        const time = typeof s === "object" && s.time_min ? ` This step takes about ${s.time_min} minutes.` : "";
        segs.push({
          label: `Step ${i + 1}`,
          text: `Step ${i + 1}. ${text}${time}`,
          type: "step",
          index: i,
        });
      });
    }
    if (recipe.nutrition) {
      const n = recipe.nutrition;
      const parts = [
        n.calories && `${n.calories} calories`,
        n.protein  && `${n.protein} protein`,
        n.carbs    && `${n.carbs} carbohydrates`,
        n.fat      && `${n.fat} fat`,
      ].filter(Boolean);
      if (parts.length) {
        segs.push({ label: "Nutrition", text: `Nutrition per serving: ${parts.join(", ")}.`, type: "nutrition" });
      }
    }
    segs.push({ label: "Done", text: "That's the complete recipe. Enjoy your meal!", type: "end" });
    return segs;
  };

  const segments = buildSegments();
  const [status, setStatus]   = useState("idle"); // idle | playing | paused
  const [curIdx, setCurIdx]   = useState(0);
  const [speed, setSpeed]     = useState(1);
  const uttRef = useRef(null);
  const idxRef = useRef(0);
  const speedRef = useRef(1);
  const statusRef = useRef("idle");

  // Keep refs in sync
  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { statusRef.current = status; }, [status]);

  // Stop everything when recipe changes or component unmounts
  useEffect(() => {
    return () => { window.speechSynthesis?.cancel(); };
  }, [recipe]);

  const speakFrom = (startIdx) => {
    window.speechSynthesis.cancel();
    idxRef.current = startIdx;
    setCurIdx(startIdx);
    setStatus("playing");
    statusRef.current = "playing";
    speakNext();
  };

  const speakNext = () => {
    if (statusRef.current !== "playing") return;
    const idx = idxRef.current;
    if (idx >= segments.length) { setStatus("idle"); setCurIdx(0); return; }

    const seg = segments[idx];
    const utt = new SpeechSynthesisUtterance(seg.text);
    utt.lang = langCode;
    utt.rate = speedRef.current;
    utt.onend = () => {
      if (statusRef.current !== "playing") return;
      idxRef.current = idx + 1;
      setCurIdx(idx + 1);
      speakNext();
    };
    utt.onerror = () => { setStatus("idle"); };
    uttRef.current = utt;
    window.speechSynthesis.speak(utt);
  };

  const handlePlay = () => {
    if (!window.speechSynthesis) return;
    if (status === "paused") {
      window.speechSynthesis.resume();
      setStatus("playing");
      statusRef.current = "playing";
    } else {
      speakFrom(status === "idle" ? 0 : curIdx);
    }
  };

  const handlePause = () => {
    window.speechSynthesis.pause();
    setStatus("paused");
    statusRef.current = "paused";
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setStatus("idle");
    setCurIdx(0);
    idxRef.current = 0;
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
    speedRef.current = newSpeed;
    if (status === "playing") {
      // restart current segment at new speed
      window.speechSynthesis.cancel();
      setTimeout(() => speakNext(), 50);
    }
  };

  const handleSegmentClick = (idx) => {
    speakFrom(idx);
  };

  const progress = segments.length ? Math.round((curIdx / segments.length) * 100) : 0;
  const currentSeg = segments[Math.min(curIdx, segments.length - 1)];
  const isActive = status === "playing" || status === "paused";

  const segTypeColor = { title: "#ef4444", meta: "#f97316", overview: "#8b5cf6", section: "#3b82f6", ingredient: "#10b981", step: "#f59e0b", nutrition: "#06b6d4", end: "#6b7280" };
  const segTypeIcon  = { title: "🍳", meta: "ℹ️", overview: "📖", section: "📢", ingredient: "🧂", step: "👨‍🍳", nutrition: "📊", end: "✅" };

  return (
    <Box sx={{ background: "linear-gradient(135deg, #0f0a08 0%, #1c0f0a 100%)", borderRadius: 3, overflow: "hidden", mb: 3 }}>
      {/* Header */}
      <Box sx={{ px: 3, py: 2, display: "flex", alignItems: "center", gap: 1.5, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <Box sx={{ width: 32, height: 32, borderRadius: 2, background: "linear-gradient(135deg,#ef4444,#f97316)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <VolumeUpIcon sx={{ fontSize: 18, color: "#fff" }} />
        </Box>
        <Box flex={1}>
          <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "0.88rem", lineHeight: 1 }}>
            Listen to Recipe
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", mt: 0.3 }}>
            {language} · {segments.length} segments
          </Typography>
        </Box>
        {isActive && (
          <Box display="flex" alignItems="center" gap={0.5}>
            {[0,1,2].map(i => (
              <Box key={i} sx={{
                width: 3, borderRadius: 2, background: "#ef4444",
                height: status === "playing" ? `${8 + i * 4}px` : "4px",
                transition: "height 0.3s ease",
                animation: status === "playing" ? `bar${i} 0.8s ease-in-out infinite alternate` : "none",
                [`@keyframes bar${i}`]: {
                  from: { height: "4px" }, to: { height: `${8 + i * 6}px` }
                },
                animationDelay: `${i * 0.15}s`,
              }} />
            ))}
          </Box>
        )}
      </Box>

      {/* Progress bar */}
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 3, borderRadius: 0,
          background: "rgba(255,255,255,0.08)",
          "& .MuiLinearProgress-bar": { background: "linear-gradient(90deg,#ef4444,#f97316)" },
        }}
      />

      {/* Current segment display */}
      {isActive && currentSeg && (
        <Box sx={{ px: 3, py: 1.5, background: "rgba(239,68,68,0.08)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Box display="flex" alignItems="flex-start" gap={1}>
            <Typography sx={{ fontSize: "0.9rem", flexShrink: 0, mt: 0.1 }}>{segTypeIcon[currentSeg.type] || "🔊"}</Typography>
            <Box>
              <Typography sx={{ color: segTypeColor[currentSeg.type] || "#ef4444", fontSize: "0.62rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", mb: 0.2 }}>
                {currentSeg.label}
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: "0.82rem", lineHeight: 1.5 }}>
                {currentSeg.text.length > 120 ? currentSeg.text.substring(0, 120) + "…" : currentSeg.text}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Controls */}
      <Box sx={{ px: 3, py: 2, display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        {/* Play/Pause */}
        {status === "playing" ? (
          <IconButton onClick={handlePause} sx={{ width: 44, height: 44, background: "#ef4444", color: "#fff", "&:hover": { background: "#dc2626" } }}>
            <PauseIcon />
          </IconButton>
        ) : (
          <IconButton onClick={handlePlay} sx={{ width: 44, height: 44, background: "linear-gradient(135deg,#ef4444,#f97316)", color: "#fff", "&:hover": { opacity: 0.9 } }}>
            <PlayArrowIcon />
          </IconButton>
        )}

        {/* Stop */}
        {isActive && (
          <IconButton onClick={handleStop} size="small" sx={{ color: "rgba(255,255,255,0.4)", "&:hover": { color: "#ef4444" } }}>
            <StopIcon sx={{ fontSize: 20 }} />
          </IconButton>
        )}

        {/* Progress text */}
        <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", flex: 1 }}>
          {status === "idle" && curIdx === 0 && "Press play to listen"}
          {status === "idle" && curIdx > 0 && "Finished"}
          {status === "playing" && `${curIdx + 1} / ${segments.length}`}
          {status === "paused" && "Paused"}
        </Typography>

        {/* Speed selector */}
        <Box display="flex" alignItems="center" gap={0.5}>
          <GraphicEqIcon sx={{ fontSize: 14, color: "rgba(255,255,255,0.3)" }} />
          {[0.8, 1, 1.2, 1.5].map(s => (
            <Box key={s} onClick={() => handleSpeedChange(s)} sx={{
              px: 1, py: 0.4, borderRadius: 1.5, cursor: "pointer", fontSize: "0.72rem", fontWeight: 700,
              background: speed === s ? "#ef4444" : "rgba(255,255,255,0.08)",
              color: speed === s ? "#fff" : "rgba(255,255,255,0.4)",
              transition: "all 0.15s",
              "&:hover": { background: speed === s ? "#ef4444" : "rgba(255,255,255,0.15)" },
            }}>{s}×</Box>
          ))}
        </Box>
      </Box>

      {/* Segment list — scrollable jump-to */}
      <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.06)", px: 2, py: 1.5, maxHeight: 160, overflowY: "auto" }}>
        <Typography sx={{ color: "rgba(255,255,255,0.25)", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", mb: 1 }}>
          Jump to section
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={0.8}>
          {segments.map((seg, i) => (
            <Box key={i} onClick={() => handleSegmentClick(i)} sx={{
              display: "inline-flex", alignItems: "center", gap: 0.5,
              px: 1.2, py: 0.4, borderRadius: "12px", cursor: "pointer",
              background: curIdx === i && isActive ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.06)",
              border: `1px solid ${curIdx === i && isActive ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.08)"}`,
              transition: "all 0.15s",
              "&:hover": { background: "rgba(239,68,68,0.15)", borderColor: "rgba(239,68,68,0.3)" },
            }}>
              <Typography sx={{ fontSize: "0.7rem" }}>{segTypeIcon[seg.type] || "🔊"}</Typography>
              <Typography sx={{ fontSize: "0.68rem", fontWeight: curIdx === i && isActive ? 700 : 400, color: curIdx === i && isActive ? "#fca5a5" : "rgba(255,255,255,0.45)", whiteSpace: "nowrap" }}>
                {seg.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const API = "http://localhost:5000";
  const [page, setPage] = useState("home");

  // ── Toast system ──
  const [toasts, setToasts] = useState([]);
  const showToast = useCallback((message, type = "success") => {
    const id = ++_toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);
  const removeToast = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);

  // ── Language ──
  const [language, setLanguage] = useState(() => localStorage.getItem("cm_lang") || "English");
  useEffect(() => {
    localStorage.setItem("cm_lang", language);
    setRecipeCache({}); // clear cached details so they re-fetch in new language
  }, [language]);

  // ── Recipe Generator state ──
  const [inputName, setInputName] = useState("");
  const [inputQty, setInputQty] = useState("");
  const [inputUnit, setInputUnit] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [activeFoodTypes, setActiveFoodTypes] = useState([]);
  const [activeDiet, setActiveDiet] = useState([]);
  const [activeDifficulty, setActiveDifficulty] = useState(null);
  const [activeCuisine, setActiveCuisine] = useState([]);
  const [recipes, setRecipes] = useState({ strict: [], flexible: [] });
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // ── Recipe by Name state ──
  const [recipeNameInput, setRecipeNameInput] = useState("");
  const [recipeByName, setRecipeByName] = useState(null);
  const [recipeByNameLoading, setRecipeByNameLoading] = useState(false);

  // ── Meal Planner state ──
  const [mpTab, setMpTab] = useState(0);

  // Tab 1: user picks specific pantry items by checkbox
  const [mpSelectedPantryIdxs, setMpSelectedPantryIdxs] = useState([]);
  const [mpPantryFoodTypes, setMpPantryFoodTypes] = useState([]);
  const [mpPantryDiet, setMpPantryDiet] = useState([]);
  const [mpPantryDifficulty, setMpPantryDifficulty] = useState(null);
  const [mpPantryCuisine, setMpPantryCuisine] = useState([]);
  const [mpPantryPlan, setMpPantryPlan] = useState([]);
  const [mpPantryLoading, setMpPantryLoading] = useState(false);

  // Tab 2: uses all in-stock pantry items automatically
  const [mpGroceryFoodTypes, setMpGroceryFoodTypes] = useState([]);
  const [mpGroceryDiet, setMpGroceryDiet] = useState([]);
  const [mpGroceryDifficulty, setMpGroceryDifficulty] = useState(null);
  const [mpGroceryCuisine, setMpGroceryCuisine] = useState([]);
  const [mpGroceryPlan, setMpGroceryPlan] = useState([]);
  const [mpGroceryLoading, setMpGroceryLoading] = useState(false);

  // ── Recipe detail modal ──
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [recipeCache, setRecipeCache] = useState({});
  const [servingMultiplier, setServingMultiplier] = useState(1);

  // ── Cook mode ──
  const [cookModeOpen, setCookModeOpen] = useState(false);

  // ── Substitution modal ──
  const [subModal, setSubModal] = useState({ open: false, ingredient: null });

  // ── Shopping list ──
  const [shoppingList, setShoppingList] = useState({ open: false, items: [], title: "" });

  // ── Saved recipes ──
  const [savedRecipes, setSavedRecipes] = useState(() =>
    JSON.parse(localStorage.getItem("savedRecipes") || "[]")
  );
  const [savedSearch, setSavedSearch] = useState("");
  const [savedVegFilter, setSavedVegFilter] = useState("all");

  // ── Recipe ratings & notes ──
  const [recipeRatings, setRecipeRatings] = useState(() =>
    JSON.parse(localStorage.getItem("recipeRatings") || "{}")
  );
  const [recipeNotes, setRecipeNotes] = useState(() =>
    JSON.parse(localStorage.getItem("recipeNotes") || "{}")
  );
  const [editingNote, setEditingNote] = useState(null);

  // ── Pantry ──
  const [pantryItems, setPantryItems] = useState(() =>
    JSON.parse(localStorage.getItem("pantryItems") || "[]")
  );
  const [pantryInputName, setPantryInputName] = useState("");
  const [pantryInputQty, setPantryInputQty] = useState("");
  const [pantryInputUnit, setPantryInputUnit] = useState("");

  // ── Onboarding ──
  const [showOnboarding, setShowOnboarding] = useState(
    !localStorage.getItem("onboardingDone")
  );

  // ── Top Rated filter ──
  const [trFilter, setTrFilter] = useState("all");

  // ── Sidebar ──
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const SIDEBAR_W = 240;
  const SIDEBAR_COLLAPSED_W = 64;

  // ── Persistence ──
  useEffect(() => {
    const saved = localStorage.getItem("ingredients");
    if (saved) setIngredients(JSON.parse(saved));
  }, []);
  useEffect(() => {
    localStorage.setItem("ingredients", JSON.stringify(ingredients));
  }, [ingredients]);
  useEffect(() => {
    localStorage.setItem("pantryItems", JSON.stringify(pantryItems));
  }, [pantryItems]);
  useEffect(() => {
    localStorage.setItem("recipeRatings", JSON.stringify(recipeRatings));
  }, [recipeRatings]);
  useEffect(() => {
    localStorage.setItem("recipeNotes", JSON.stringify(recipeNotes));
  }, [recipeNotes]);

  // ── Helpers ──
  const addIngredient = useCallback(() => {
    if (!inputName.trim()) return;
    setIngredients(prev => [...prev, { name: inputName.trim(), qty: inputQty.trim(), unit: inputUnit }]);
    setInputName(""); setInputQty(""); setInputUnit("");
  }, [inputName, inputQty, inputUnit]);

  const toggleArr = (arr, setArr, val) =>
    setArr(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

  const totalFilters = activeFoodTypes.length + activeDiet.length + (activeDifficulty ? 1 : 0) + activeCuisine.length;

  const scaleQty = (quantityStr, mult) => {
    if (!quantityStr || mult === 1) return quantityStr;
    const match = quantityStr.match(/^([\d./]+)/);
    if (!match) return quantityStr;
    const num = eval(match[1]);
    const scaled = Math.round(num * mult * 4) / 4;
    return quantityStr.replace(match[1], scaled % 1 === 0 ? scaled : scaled.toString());
  };

  // ── Recipe Generator ──
  const generateRecipes = async () => {
    if (!ingredients.length) return showToast("Add at least one ingredient first", "error");
    setRecipeLoading(true);
    try {
      const res = await axios.post(`${API}/generate-recipes`, {
        ingredients,
        filters: { cuisine: activeCuisine, foodTypes: activeFoodTypes, diet: activeDiet, difficulty: activeDifficulty },
        language,
      });
      setRecipes(res.data);
      setTimeout(() => document.getElementById("results-anchor")?.scrollIntoView({ behavior: "smooth" }), 150);
    } catch { showToast("Error generating recipes", "error"); }
    setRecipeLoading(false);
  };

  // ── Generate by name ──
  const generateByName = async () => {
    if (!recipeNameInput.trim()) return showToast("Enter a recipe name first", "error");
    setRecipeByNameLoading(true); setRecipeByName(null);
    try {
      const res = await axios.post(`${API}/generate-by-name`, {
        recipeName: recipeNameInput.trim(),
        filters: { cuisine: activeCuisine, foodTypes: activeFoodTypes, diet: activeDiet, difficulty: activeDifficulty },
        language,
      });
      setRecipeByName(res.data);
      setTimeout(() => document.getElementById("byname-anchor")?.scrollIntoView({ behavior: "smooth" }), 150);
    } catch { showToast("Error generating recipe", "error"); }
    setRecipeByNameLoading(false);
  };

  const generatePantryPlan = async () => {
    const selectedItems = mpSelectedPantryIdxs.map(idx => pantryItems[idx]).filter(Boolean);
    if (!selectedItems.length) return showToast("Select at least one pantry item to cook with", "error");
    setMpPantryLoading(true);
    try {
      const res = await axios.post(`${API}/generate-meal-plan`, {
        ingredients: selectedItems,
        filters: { cuisine: mpPantryCuisine, foodTypes: mpPantryFoodTypes, diet: mpPantryDiet, difficulty: mpPantryDifficulty },
        mode: "pantry",
        language,
      });
      setMpPantryPlan(res.data.plan);
      setTimeout(() => document.getElementById("pantry-plan-anchor")?.scrollIntoView({ behavior: "smooth" }), 150);
    } catch { showToast("Error generating pantry meal plan", "error"); }
    setMpPantryLoading(false);
  };

  const generateGroceryPlan = async () => {
    const inStockItems = pantryItems.filter(i => i.inStock);
    if (!inStockItems.length) return showToast("Your pantry is empty — add items in My Pantry first", "error");
    setMpGroceryLoading(true);
    try {
      const res = await axios.post(`${API}/generate-meal-plan`, {
        ingredients: inStockItems,
        filters: { cuisine: mpGroceryCuisine, foodTypes: mpGroceryFoodTypes, diet: mpGroceryDiet, difficulty: mpGroceryDifficulty },
        mode: "pantry",
        language,
      });
      setMpGroceryPlan(res.data.plan);
      setTimeout(() => document.getElementById("grocery-plan-anchor")?.scrollIntoView({ behavior: "smooth" }), 150);
    } catch { showToast("Error generating full pantry meal plan", "error"); }
    setMpGroceryLoading(false);
  };

  // ── Recipe details ──
  const fetchDetails = async (title) => {
    setOpen(true); setServingMultiplier(1);
    if (recipeCache[title]) { setDetails(recipeCache[title]); return; }
    setDetails(null); setDetailsLoading(true);
    try {
      const res = await axios.post(`${API}/recipe-details`, { recipeName: title, language });
      const enriched = { ...res.data, _title: title };
      setRecipeCache(prev => ({ ...prev, [title]: enriched }));
      setDetails(enriched);
    } catch { showToast("Failed to load details", "error"); }
    setDetailsLoading(false);
  };

  const saveRecipe = () => {
    if (!details) return;
    if (savedRecipes.find(r => r._title === details._title)) {
      showToast("Already saved!", "error"); return;
    }
    const updated = [...savedRecipes, details];
    setSavedRecipes(updated);
    localStorage.setItem("savedRecipes", JSON.stringify(updated));
    showToast(`"${details._title}" saved to your cookbook! 📖`, "success");
  };

  const deleteRecipe = (index) => {
    const updated = savedRecipes.filter((_, i) => i !== index);
    setSavedRecipes(updated);
    localStorage.setItem("savedRecipes", JSON.stringify(updated));
    showToast("Recipe removed", "success");
  };

  const setRating = (title, rating) => {
    setRecipeRatings(prev => ({ ...prev, [title]: rating }));
  };

  const saveNote = (title, note) => {
    setRecipeNotes(prev => ({ ...prev, [title]: note }));
    setEditingNote(null);
    showToast("Note saved!", "success");
  };

  // ── Pantry handlers ──
  const addPantryItem = () => {
    if (!pantryInputName.trim()) return;
    setPantryItems(prev => [...prev, {
      name: pantryInputName.trim(), qty: pantryInputQty.trim(),
      unit: pantryInputUnit, inStock: true,
    }]);
    setPantryInputName(""); setPantryInputQty(""); setPantryInputUnit("");
  };

  const togglePantryItem = (idx) => {
    setPantryItems(prev => prev.map((item, i) =>
      i === idx ? { ...item, inStock: !item.inStock } : item
    ));
  };

  const removePantryItem = (idx) => {
    setPantryItems(prev => prev.filter((_, i) => i !== idx));
  };

  const updatePantryQty = (idx, delta) => {
    setPantryItems(prev => prev.map((item, i) => {
      if (i !== idx) return item;
      const currentQty = parseFloat(item.qty) || 0;
      const newQty = Math.max(0, Math.round((currentQty + delta) * 100) / 100);
      return { ...item, qty: newQty === 0 ? "0" : String(newQty), inStock: newQty > 0 };
    }));
    if (delta < 0) showToast("Quantity updated — 1 consumed 🍽️", "info");
  };

  const setPantryQtyDirect = (idx, value) => {
    setPantryItems(prev => prev.map((item, i) => {
      if (i !== idx) return item;
      const newQty = Math.max(0, parseFloat(value) || 0);
      return { ...item, qty: String(newQty), inStock: newQty > 0 };
    }));
  };

  const importPantryToGenerator = () => {
    const inStock = pantryItems.filter(i => i.inStock);
    setIngredients(inStock);
    setPage("recipes");
    showToast(`${inStock.length} pantry items imported to Recipe Generator`, "success");
  };
const exportMealPlanPDF = (plan, title = "Weekly Meal Plan") => {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
 
  // ── Header bar ──
  doc.setFillColor(239, 68, 68);
  doc.rect(0, 0, pageW, 22, "F");
 
  // Logo emoji area
  doc.setFillColor(220, 40, 40);
  doc.roundedRect(10, 4, 14, 14, 3, 3, "F");
  doc.setFontSize(11);
  doc.text("🍳", 13.5, 13.5);
 
  // App name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("ChefMind", 27, 10);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("AI Kitchen Assistant", 27, 16);
 
  // Plan title (right-aligned in header)
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(title, pageW - 12, 10, { align: "right" });
 
  // Generated date
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${today}`, pageW - 12, 17, { align: "right" });
 
  // ── Build table data ──
  const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];
  const days = plan.map(d => d.day);
 
  // One row per meal type, one column per day
  const tableBody = MEAL_TYPES.map(meal => {
    const row = [
      {
        content: meal,
        styles: {
          fontStyle: "bold",
          fillColor: meal === "Breakfast" ? [255, 247, 237]
            : meal === "Lunch"     ? [240, 253, 244]
            : meal === "Dinner"    ? [239, 246, 255]
            :                        [253, 244, 255],
          textColor: meal === "Breakfast" ? [194, 65, 12]
            : meal === "Lunch"     ? [21, 128, 61]
            : meal === "Dinner"    ? [29, 78, 216]
            :                        [126, 34, 206],
          halign: "center",
          valign: "middle",
          fontSize: 8,
        },
      },
    ];
 
    days.forEach(day => {
      const dayObj = plan.find(d => d.day === day);
      const entry  = dayObj?.meals?.[meal];
      const name   = entry?.name  || "—";
      const note   = entry?.note  || "";
      row.push({
        content: note ? `${name}\n${note}` : name,
        styles:  {
          fontSize: 8,
          cellPadding: 3,
          valign: "top",
          textColor: [30, 30, 30],
          fillColor: [255, 255, 255],
        },
      });
    });
    return row;
  });
 
  // Day-name header row colors
  const DAY_HEADER_COLORS = {
    Monday:    [249, 115, 22],
    Tuesday:   [168, 85, 247],
    Wednesday: [59, 130, 246],
    Thursday:  [34, 197, 94],
    Friday:    [239, 68, 68],
  };
 
  const headRow = [
    { content: "Meal", styles: { fillColor: [30, 30, 30], textColor: [255, 255, 255], halign: "center", fontStyle: "bold", fontSize: 9 } },
    ...days.map(day => ({
      content: day,
      styles: {
        fillColor: DAY_HEADER_COLORS[day] || [100, 100, 100],
        textColor: [255, 255, 255],
        halign: "center",
        fontStyle: "bold",
        fontSize: 9,
      },
    })),
  ];
 
  // Column widths — meal label narrow, days share remaining space equally
  const usableW   = pageW - 20;
  const mealColW  = 22;
  const dayColW   = (usableW - mealColW) / days.length;
  const colWidths = [mealColW, ...days.map(() => dayColW)];
 
  autoTable(doc, {
    startY: 26,
    head: [headRow],
    body: tableBody,
    columnStyles: colWidths.reduce((acc, w, i) => { acc[i] = { cellWidth: w }; return acc; }, {}),
    styles: {
      lineColor: [229, 231, 235],
      lineWidth: 0.3,
      font: "helvetica",
      cellPadding: 3,
      minCellHeight: 18,
    },
    headStyles: { minCellHeight: 10 },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    margin: { left: 10, right: 10 },
    tableLineColor: [209, 213, 219],
    tableLineWidth: 0.4,
    didDrawCell: (data) => {
      // Bold the meal name part when there's a note (first line)
      if (data.section === "body" && data.column.index > 0) {
        const entry = plan.find(d => d.day === days[data.column.index - 1])?.meals?.[MEAL_TYPES[data.row.index]];
        if (entry?.name && entry?.note) {
          const x = data.cell.x + 3;
          const y = data.cell.y + 7;
          doc.setFontSize(8);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(30, 30, 30);
          doc.text(entry.name, x, y);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7);
          doc.setTextColor(107, 114, 128);
          doc.text(entry.note, x, y + 5, { maxWidth: data.cell.width - 6 });
        }
      }
    },
  });
 
  // ── Footer ──
  const finalY = doc.lastAutoTable.finalY || pageH - 20;
  if (finalY < pageH - 16) {
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.4);
    doc.line(10, finalY + 6, pageW - 10, finalY + 6);
    doc.setFontSize(7);
    doc.setTextColor(156, 163, 175);
    doc.setFont("helvetica", "normal");
    doc.text("Generated by ChefMind AI Kitchen Assistant", 10, finalY + 12);
    doc.text(`Page 1`, pageW - 10, finalY + 12, { align: "right" });
  }
 
  // ── Save ──
  const fileName = `${title.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
};
 
  // ── Shopping list from plan ──
  const openShoppingList = (plan, title) => {
    const allIngredients = [];
    plan.forEach(d => Object.values(d.meals).forEach(m => {
      if (m.name) allIngredients.push({ name: m.name });
    }));
    setShoppingList({ open: true, items: allIngredients, title: title || "Shopping List" });
  };

  const openFlexibleShoppingList = (recipe) => {
    if (!recipe?.missing_ingredients?.length) {
      showToast("No extra ingredients needed for this recipe", "error"); return;
    }
    setShoppingList({ open: true, items: recipe.missing_ingredients, title: `Shopping: ${recipe.title}` });
  };

  // ── Shared card styles ──
  const cardSx = {
    cursor: "pointer", borderRadius: 3, overflow: "hidden",
    border: "1px solid #f3f4f6", boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    transition: "all 0.22s ease",
    "&:hover": { transform: "translateY(-4px)", boxShadow: "0 8px 24px rgba(239,68,68,0.14)", borderColor: "#fca5a5" },
  };

  const badgeSx = (color) => ({
    position: "absolute", top: 10, left: 10,
    background: color, color: "#fff", borderRadius: "8px",
    px: 1, py: 0.3, fontSize: "0.66rem", fontWeight: 800, letterSpacing: "0.06em",
  });

  const GenerateBtn = ({ onClick, loading, disabled, label }) => (
    <Button variant="contained" fullWidth size="large" onClick={onClick}
      disabled={loading || disabled}
      sx={{
        background: "linear-gradient(135deg, #ef4444, #f97316)",
        borderRadius: 3, py: 1.6, fontSize: "1rem", fontWeight: 800,
        boxShadow: "0 4px 20px rgba(239,68,68,0.25)",
        "&:hover": { boxShadow: "0 6px 28px rgba(239,68,68,0.38)" },
      }}>
      {loading
        ? <Box display="flex" alignItems="center" gap={1.5}>
            <CircularProgress size={20} sx={{ color: "#fff" }} />
            <span>Generating…</span>
          </Box>
        : label}
    </Button>
  );

  const navItems = [
    { muiIcon: <HomeIcon sx={{ fontSize: 20 }} />, label: "Home", key: "home" },
    { muiIcon: <RestaurantIcon sx={{ fontSize: 20 }} />, label: "Recipe Generator", key: "recipes" },
    { muiIcon: <CalendarMonthIcon sx={{ fontSize: 20 }} />, label: "Meal Planner", key: "planner" },
    { muiIcon: <InventoryIcon sx={{ fontSize: 20 }} />, label: "My Pantry", key: "pantry" },
    { muiIcon: <BookmarkIcon sx={{ fontSize: 20 }} />, label: "Saved Recipes", key: "saved" },
    { muiIcon: <StarIcon sx={{ fontSize: 20 }} />, label: "Top Rated Recipes", key: "toprated" },
  ];

  return (
    <Box display="flex" sx={{ background: "#f8f4ef", minHeight: "100vh" }}>

      {/* ── Onboarding ── */}
      {showOnboarding && (
        <OnboardingFlow
          setPage={setPage}
          onFinish={() => {
            setShowOnboarding(false);
            localStorage.setItem("onboardingDone", "1");
          }}
        />
      )}

      {/* ── Toast container ── */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* ── Shopping list modal ── */}
      <ShoppingListModal
        open={shoppingList.open}
        onClose={() => setShoppingList(s => ({ ...s, open: false }))}
        items={shoppingList.items}
        title={shoppingList.title}
      />

      {/* ── Substitution modal ── */}
      <SubstitutionModal
        open={subModal.open}
        ingredient={subModal.ingredient}
        recipeName={details?._title}
        onClose={() => setSubModal({ open: false, ingredient: null })}
      />

      {/* ── Cook mode ── */}
      <CookMode
        open={cookModeOpen}
        recipe={details}
        language={language}
        onClose={() => setCookModeOpen(false)}
      />

      {/* ── SIDEBAR ── */}
      <Box sx={{
        position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 1200,
        width: sidebarOpen ? SIDEBAR_W : SIDEBAR_COLLAPSED_W,
        transition: "width 0.28s cubic-bezier(0.4,0,0.2,1)",
        background: "linear-gradient(180deg, #1a0a06 0%, #2d1208 50%, #1a0a06 100%)",
        boxShadow: "4px 0 24px rgba(0,0,0,0.22)",
        borderRight: "1px solid rgba(239,68,68,0.1)",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {/* Logo row */}
        <Box sx={{
          display: "flex", alignItems: "center",
          justifyContent: sidebarOpen ? "space-between" : "center",
          px: sidebarOpen ? 2.5 : 1, pt: 2.5, pb: 1.5,
          minHeight: 64, flexShrink: 0,
        }}>
          {sidebarOpen && (
            <Box display="flex" alignItems="center" gap={1}>
              <Box sx={{
                width: 34, height: 34, borderRadius: 2, flexShrink: 0,
                background: "linear-gradient(135deg, #ef4444, #f97316)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17,
                boxShadow: "0 4px 12px rgba(239,68,68,0.4)",
              }}>🍳</Box>
              <Box>
                <Typography sx={{ fontWeight: 900, fontSize: "1.1rem", color: "#fff", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
                  ChefMind
                </Typography>
                <Typography sx={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.3)", lineHeight: 1 }}>
                  AI Kitchen Assistant
                </Typography>
              </Box>
            </Box>
          )}
          {!sidebarOpen && (
            <Box sx={{
              width: 34, height: 34, borderRadius: 2,
              background: "linear-gradient(135deg, #ef4444, #f97316)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17,
              boxShadow: "0 4px 12px rgba(239,68,68,0.4)",
            }}>🍳</Box>
          )}
          {sidebarOpen && (
            <IconButton onClick={() => setSidebarOpen(false)} size="small"
              sx={{ color: "rgba(255,255,255,0.4)", ml: 0.5, "&:hover": { background: "rgba(239,68,68,0.15)", color: "#fca5a5" } }}>
              <ChevronLeftIcon sx={{ fontSize: 20 }} />
            </IconButton>
          )}
        </Box>

        {!sidebarOpen && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 1, mb: 0.5 }}>
            <IconButton onClick={() => setSidebarOpen(true)} size="small"
              sx={{ color: "rgba(255,255,255,0.4)", "&:hover": { background: "rgba(239,68,68,0.15)", color: "#fca5a5" } }}>
              <ChevronRightIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        )}

        <Box sx={{ height: "1px", background: "rgba(255,255,255,0.06)", mx: sidebarOpen ? 2.5 : 1, mb: 1.5, flexShrink: 0 }} />

        <Box sx={{ px: sidebarOpen ? 1.5 : 1, flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          {navItems.map(({ muiIcon, label, key }) => {
            const isActive = page === key;
            const item = (
              <Box key={key} onClick={() => setPage(key)} sx={{
                display: "flex", alignItems: "center",
                gap: sidebarOpen ? 1.5 : 0,
                justifyContent: sidebarOpen ? "flex-start" : "center",
                px: sidebarOpen ? 1.5 : 0, py: 1.1, borderRadius: 2, mb: 0.5,
                cursor: "pointer",
                background: isActive ? "rgba(239,68,68,0.18)" : "transparent",
                border: isActive ? "1px solid rgba(239,68,68,0.3)" : "1px solid transparent",
                color: isActive ? "#fca5a5" : "rgba(255,255,255,0.45)",
                transition: "all 0.18s ease",
                "&:hover": { background: "rgba(239,68,68,0.1)", color: "#fca5a5", borderColor: "rgba(239,68,68,0.15)" },
                overflow: "hidden", whiteSpace: "nowrap", minHeight: 42,
              }}>
                <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0, color: "inherit" }}>
                  {muiIcon}
                </Box>
                {sidebarOpen && (
                  <Typography sx={{ fontWeight: isActive ? 700 : 500, fontSize: "0.88rem", color: "inherit", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {label}
                  </Typography>
                )}
              </Box>
            );
            return sidebarOpen ? item : (
              <Tooltip key={key} title={label} placement="right" arrow>{item}</Tooltip>
            );
          })}
        </Box>

        {savedRecipes.length > 0 && (
          <Box sx={{
            mx: sidebarOpen ? 1.5 : 1, mb: 2.5, flexShrink: 0,
            p: sidebarOpen ? 1.5 : 1,
            background: "rgba(239,68,68,0.12)", borderRadius: 2,
            border: "1px solid rgba(239,68,68,0.2)",
            display: "flex", alignItems: "center",
            justifyContent: sidebarOpen ? "flex-start" : "center",
            gap: 1, overflow: "hidden",
          }}>
            <Typography sx={{ fontSize: sidebarOpen ? "0.75rem" : "0.9rem", flexShrink: 0 }}>💾</Typography>
            {sidebarOpen && (
              <Typography variant="caption" sx={{ color: "#fca5a5", fontWeight: 700, whiteSpace: "nowrap" }}>
                {savedRecipes.length} saved recipe{savedRecipes.length !== 1 ? "s" : ""}
              </Typography>
            )}
          </Box>
        )}
      </Box>

      {/* ── MAIN ── */}
      <Box flex={1} sx={{
        ml: sidebarOpen ? `${SIDEBAR_W}px` : `${SIDEBAR_COLLAPSED_W}px`,
        transition: "margin-left 0.28s cubic-bezier(0.4,0,0.2,1)",
      }}>

        {/* ══ HOME ══ */}
        {page === "home" && (
          <Box sx={{ minHeight: "100vh", background: "#0f0a08" }}>
            <Box sx={{ position: "relative", height: "100vh", minHeight: 600, overflow: "hidden", display: "flex", alignItems: "center" }}>
              <Box component="img"
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1800&q=80"
                alt="hero food"
                sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", filter: "brightness(0.45) saturate(1.2)", transform: "scale(1.03)" }}
              />
              <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(15,10,8,0.72) 0%, rgba(15,10,8,0.2) 60%, transparent 100%)" }} />
              <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "38%", background: "linear-gradient(to top, #0f0a08 0%, transparent 100%)" }} />

              <Box sx={{ position: "relative", zIndex: 2, px: { xs: 4, md: 8 }, maxWidth: 780 }}>
                <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, background: "rgba(239,68,68,0.18)", border: "1px solid rgba(239,68,68,0.4)", borderRadius: "100px", px: 2, py: 0.6, mb: 3, backdropFilter: "blur(8px)" }}>
                  <Box sx={{ width: 7, height: 7, borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 8px #ef4444" }} />
                  <Typography sx={{ color: "#fca5a5", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>AI-Powered Kitchen Assistant</Typography>
                </Box>
                <Typography sx={{ fontFamily: "'Georgia', serif", fontWeight: 900, fontSize: { xs: "3.2rem", md: "5rem" }, lineHeight: 1.02, letterSpacing: "-2px", color: "#fff", mb: 1, textShadow: "0 4px 32px rgba(0,0,0,0.5)" }}>
                  Cook Smarter.<br />
                  <Box component="span" sx={{ background: "linear-gradient(90deg, #f97316, #ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Waste Nothing.
                  </Box>
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.72)", fontSize: "1.15rem", fontWeight: 400, lineHeight: 1.65, maxWidth: 520, mb: 4.5, textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>
                  Turn whatever's in your fridge into restaurant-quality meals. ChefMind generates tailored recipes and weekly meal plans in seconds.
                </Typography>
                <Box display="flex" gap={2} flexWrap="wrap">
                  <Button variant="contained" size="large" onClick={() => setPage("recipes")}
                    sx={{ background: "linear-gradient(135deg, #ef4444, #f97316)", borderRadius: "12px", px: 4, py: 1.6, fontSize: "1rem", fontWeight: 700, boxShadow: "0 8px 32px rgba(239,68,68,0.45)", "&:hover": { boxShadow: "0 12px 40px rgba(239,68,68,0.55)", transform: "translateY(-2px)" }, transition: "all 0.2s ease" }}>
                    Generate Recipes →
                  </Button>
                  <Button variant="outlined" size="large" onClick={() => setPage("planner")}
                    sx={{ borderColor: "rgba(255,255,255,0.35)", color: "#fff", borderRadius: "12px", px: 4, py: 1.6, fontSize: "1rem", fontWeight: 600, backdropFilter: "blur(8px)", background: "rgba(255,255,255,0.07)", "&:hover": { borderColor: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.13)" } }}>
                    Plan My Week
                  </Button>
                </Box>
                <Box display="flex" gap={4} mt={5} flexWrap="wrap">
                  {[{ num: "6+", label: "Recipes per run" }, { num: "5", label: "Day meal plans" }, { num: "12", label: "Cuisine styles" }].map((s, i) => (
                    <Box key={i}>
                      <Typography sx={{ color: "#f97316", fontWeight: 900, fontSize: "1.8rem", lineHeight: 1, fontFamily: "'Georgia', serif" }}>{s.num}</Typography>
                      <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", fontWeight: 500, mt: 0.3 }}>{s.label}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Floating recipe card */}
              <Box sx={{ display: { xs: "none", lg: "flex" }, position: "absolute", right: 80, top: "50%", transform: "translateY(-50%) rotate(2deg)", flexDirection: "column", background: "rgba(255,255,255,0.09)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: "20px", p: 2.5, width: 220, zIndex: 2, boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }}>
                <Box component="img" src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80" alt="recipe" sx={{ width: "100%", height: 130, objectFit: "cover", borderRadius: "12px", mb: 1.5 }} />
                <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "0.88rem", mb: 0.5 }}>Spiced Chickpea Bowl</Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.75rem", mb: 1.5, lineHeight: 1.4 }}>Creamy tahini, roasted veggies, fresh herbs</Typography>
                <Box display="flex" gap={0.8}>
                  {["🟢 Easy", "🌱 Vegan"].map((tag, i) => (
                    <Box key={i} sx={{ background: "rgba(249,115,22,0.2)", border: "1px solid rgba(249,115,22,0.35)", borderRadius: "6px", px: 0.9, py: 0.3, fontSize: "0.65rem", fontWeight: 700, color: "#fdba74" }}>{tag}</Box>
                  ))}
                </Box>
              </Box>
            </Box>

            {/* Features strip */}
            <Box sx={{ background: "#0f0a08", px: { xs: 4, md: 8 }, py: 8 }}>
              <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", mb: 4 }}>
                Everything you need
              </Typography>
              <Grid container spacing={3}>
                {[
                  { icon: "🔒", title: "Exact Ingredient Match", desc: "Recipes built from only what you have — no surprise pantry requirements.", accent: "#f97316", page: "recipes" },
                  { icon: "⚡", title: "Flexible Suggestions", desc: "Your ingredients as the base, plus smart extras to expand your options.", accent: "#ef4444", page: "recipes" },
                  { icon: "📅", title: "5-Day Meal Plans", desc: "Full week planned in one click — pantry mode or grocery haul mode.", accent: "#f59e0b", page: "planner" },
                  { icon: "🌍", title: "12 Cuisine Styles", desc: "Filter by Italian, Japanese, Mexican, Indian and more. Every recipe adapts.", accent: "#22c55e", page: "recipes" },
                ].map((feat, i) => (
                  <Grid item xs={12} sm={6} md={3} key={i}>
                    <Box onClick={() => setPage(feat.page)} sx={{
                      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", p: 3, cursor: "pointer",
                      transition: "all 0.22s ease",
                      "&:hover": { background: "rgba(255,255,255,0.08)", borderColor: `${feat.accent}55`, transform: "translateY(-4px)", boxShadow: "0 16px 40px rgba(0,0,0,0.3)" },
                    }}>
                      <Box sx={{ width: 48, height: 48, borderRadius: "12px", background: `${feat.accent}22`, border: `1px solid ${feat.accent}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", mb: 2 }}>{feat.icon}</Box>
                      <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem", mb: 0.8 }}>{feat.title}</Typography>
                      <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", lineHeight: 1.6 }}>{feat.desc}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Box mt={8} sx={{ borderRadius: "20px", overflow: "hidden", height: 260, position: "relative", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}>
                <Box component="img" src="https://images.unsplash.com/photo-1543353071-873f17a7a088?w=1600&q=80" alt="food spread"
                  sx={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 60%", filter: "brightness(0.6) saturate(1.1)" }} />
                <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 2, background: "rgba(0,0,0,0.25)" }}>
                  <Typography sx={{ fontFamily: "'Georgia', serif", color: "#fff", fontWeight: 900, fontSize: { xs: "1.6rem", md: "2.4rem" }, textAlign: "center", textShadow: "0 4px 24px rgba(0,0,0,0.6)", letterSpacing: "-0.5px" }}>
                    From pantry to plate — in seconds.
                  </Typography>
                  <Button variant="contained" onClick={() => setPage("recipes")} sx={{ background: "linear-gradient(135deg, #ef4444, #f97316)", borderRadius: "10px", px: 4, py: 1.3, fontWeight: 700, fontSize: "0.95rem", boxShadow: "0 8px 24px rgba(239,68,68,0.4)", "&:hover": { transform: "translateY(-2px)", boxShadow: "0 12px 32px rgba(239,68,68,0.5)" }, transition: "all 0.2s ease" }}>
                    Try It Free →
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {/* ══ RECIPE GENERATOR ══ */}
        {page === "recipes" && (
          <Box sx={{ minHeight: "100vh", background: "linear-gradient(160deg, #fdf8f0 0%, #fef3e2 45%, #fdf6ec 100%)", position: "relative", overflow: "hidden" }}>
            <Box sx={{ position: "fixed", top: 60, right: -80, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none", zIndex: 0 }} />
            <Box sx={{ position: "fixed", bottom: 100, left: 100, width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(239,68,68,0.09) 0%, transparent 70%)", filter: "blur(50px)", pointerEvents: "none", zIndex: 0 }} />
            <Box sx={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.45, backgroundImage: "radial-gradient(circle, #d97706 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

            {/* Page banner */}
            <Box sx={{ position: "relative", zIndex: 1, overflow: "hidden", background: "linear-gradient(125deg, #1c0a02 0%, #3b1208 40%, #5c1a0a 70%, #7c2d12 100%)", px: { xs: 4, md: 6 }, py: 4.5 }}>
              <Box sx={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "repeating-linear-gradient(45deg, #f97316 0px, #f97316 1px, transparent 1px, transparent 12px)" }} />
              {["🥚","🧅","🫑","🧄","🍋","🥬","🌶️","🧂"].map((e, i) => (
                <Box key={i} sx={{ position: "absolute", fontSize: i % 2 === 0 ? "1.6rem" : "1.1rem", opacity: 0.12, pointerEvents: "none", userSelect: "none", top: `${10 + (i * 11) % 70}%`, right: `${4 + (i * 7) % 40}%`, transform: `rotate(${-20 + i * 11}deg)` }}>{e}</Box>
              ))}
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Box display="flex" alignItems="flex-start" justifyContent="space-between" flexWrap="wrap" gap={2}>
                  <Box>
                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, background: "rgba(249,115,22,0.2)", border: "1px solid rgba(249,115,22,0.4)", borderRadius: "100px", px: 2, py: 0.5, mb: 2 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "#f97316", boxShadow: "0 0 6px #f97316" }} />
                      <Typography sx={{ color: "#fdba74", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>AI Recipe Engine</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 900, fontSize: { xs: "1.8rem", md: "2.4rem" }, letterSpacing: "-1.5px", color: "#fff", lineHeight: 1.1, mb: 1 }}>
                      🍳 Recipe Generator
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem", maxWidth: 520 }}>
                      Add your ingredients, set your filters (including cuisine!), and get AI-crafted recipes
                    </Typography>
                  </Box>
                  {/* Language selector */}
                  <Box sx={{ mt: 0.5 }}>
                    <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", mb: 0.8 }}>
                      Recipe Language
                    </Typography>
                    <LanguagePill value={language} onChange={setLanguage} accentColor="#f97316" accentBg="#fff7ed" />
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box p={4} maxWidth={960} mx="auto" sx={{ position: "relative", zIndex: 1 }}>

              {/* Ingredient input */}
              <Box sx={{ background: "#fff", borderRadius: 3, p: 3, border: "1px solid #f3f4f6", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", mb: 2 }}>
                <Typography fontWeight={700} mb={2} color="#374151">📦 Your Ingredients</Typography>
                <Box display="flex" gap={1.5} flexWrap="wrap" alignItems="flex-start">
                  <TextField label="Ingredient" value={inputName}
                    onChange={e => setInputName(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addIngredient()}
                    placeholder="e.g. eggs" size="small" sx={{ flex: "1 1 150px", minWidth: 130 }} />
                  <TextField label="Qty" type="number" value={inputQty}
                    onChange={e => setInputQty(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addIngredient()}
                    placeholder="2" size="small" inputProps={{ min: 0, step: "any" }} sx={{ width: 80 }} />
                  <FormControl size="small" sx={{ minWidth: 110 }}>
                    <InputLabel>Unit</InputLabel>
                    <Select value={inputUnit} label="Unit" onChange={e => setInputUnit(e.target.value)}>
                      {UNITS.map(u => <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <Button variant="contained" onClick={addIngredient} startIcon={<AddCircleOutlineIcon />}
                    sx={{ background: "linear-gradient(135deg, #ef4444, #f97316)", borderRadius: 2, fontWeight: 700, height: 40, boxShadow: "none", "&:hover": { boxShadow: "0 2px 12px rgba(239,68,68,0.3)" } }}>
                    Add
                  </Button>
                  {/* Voice input */}
                  <MicButton onResult={(t) => setInputName(prev => prev ? prev + " " + t : t)} />
                  {/* Image scan */}
                  <ImageScanButton
                    accentColor="#ef4444"
                    onConfirm={(items) => setIngredients(prev => [...prev, ...items])}
                  />
                </Box>
                {ingredients.length === 0 ? (
                  <Box mt={2} py={2} textAlign="center" sx={{ border: "1.5px dashed #f3f4f6", borderRadius: 2 }}>
                    <Typography fontSize="0.85rem" color="text.disabled">No ingredients yet — add some above or import from My Pantry</Typography>
                    <Button size="small" onClick={() => setPage("pantry")} sx={{ mt: 1, color: "#f97316", fontSize: "0.78rem" }}>Go to My Pantry →</Button>
                  </Box>
                ) : (
                  <Box mt={1.5} display="flex" flexWrap="wrap" gap={1}>
                    {ingredients.map((ing, idx) => (
                      <Chip key={idx}
                        label={[ing.qty, ing.unit, ing.name].filter(Boolean).join(" ")}
                        onDelete={() => setIngredients(ingredients.filter((_, i) => i !== idx))}
                        deleteIcon={<CloseIcon sx={{ fontSize: "0.85rem !important" }} />}
                        sx={{ background: "#fff5f5", color: "#ef4444", border: "1px solid #fca5a5", fontWeight: 600, fontSize: "0.8rem", "& .MuiChip-deleteIcon": { color: "#f87171" } }}
                      />
                    ))}
                  </Box>
                )}
              </Box>

              {/* Filters — inline with cuisine */}
              <Box sx={{ background: "#fff", borderRadius: 3, border: "1px solid #f3f4f6", overflow: "hidden", mb: 2 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between"
                  px={3} py={2} sx={{ cursor: "pointer", "&:hover": { background: "#fafafa" } }}
                  onClick={() => setFiltersOpen(!filtersOpen)}>
                  <Box display="flex" alignItems="center" gap={1.2}>
                    <TuneIcon sx={{ color: "#ef4444", fontSize: 20 }} />
                    <Typography fontWeight={700} color="#374151">Filters</Typography>
                    {totalFilters > 0 && (
                      <Box sx={{ background: "#ef4444", color: "#fff", borderRadius: "12px", px: 1, py: 0.1, fontSize: "0.7rem", fontWeight: 800, minWidth: 22, textAlign: "center" }}>{totalFilters}</Box>
                    )}
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {filtersOpen ? "▲ Hide" : "▼ Show"} · cuisine, food type, diet, difficulty
                  </Typography>
                </Box>
                {filtersOpen && (
                  <Box px={3} pb={3}>
                    <Divider sx={{ mb: 2.5 }} />
                    <Typography variant="overline" sx={{ fontWeight: 800, color: "#6b7280", letterSpacing: "0.08em", fontSize: "0.68rem" }}>🌍 Cuisine</Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} mt={1} mb={3}>
                      {CUISINE_OPTIONS.map(c => (
                        <FilterPill key={c.label} item={c} active={activeCuisine.includes(c.label)} onClick={() => toggleArr(activeCuisine, setActiveCuisine, c.label)} />
                      ))}
                    </Box>
                    <Typography variant="overline" sx={{ fontWeight: 800, color: "#6b7280", letterSpacing: "0.08em", fontSize: "0.68rem" }}>🍽️ Food Type</Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} mt={1} mb={3}>
                      {FOOD_TYPES.map(f => (
                        <FilterPill key={f.label} item={f} active={activeFoodTypes.includes(f.label)} onClick={() => toggleArr(activeFoodTypes, setActiveFoodTypes, f.label)} />
                      ))}
                    </Box>
                    <Typography variant="overline" sx={{ fontWeight: 800, color: "#6b7280", letterSpacing: "0.08em", fontSize: "0.68rem" }}>🥦 Dietary Preferences</Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                      {DIET_OPTIONS.map(d => (
                        <FilterPill key={d.label} item={d} active={activeDiet.includes(d.label)} onClick={() => toggleArr(activeDiet, setActiveDiet, d.label)} />
                      ))}
                    </Box>
                    <Box mt={3}>
                      <Typography variant="overline" sx={{ fontWeight: 800, color: "#6b7280", letterSpacing: "0.08em", fontSize: "0.68rem" }}>🎯 Difficulty Level</Typography>
                      <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                        {DIFFICULTY_OPTIONS.map(d => (
                          <FilterPill key={d.label} item={d} active={activeDifficulty === d.label} onClick={() => setActiveDifficulty(prev => prev === d.label ? null : d.label)} />
                        ))}
                      </Box>
                    </Box>
                    {totalFilters > 0 && (
                      <Box mt={2}>
                        <Button size="small" onClick={() => { setActiveFoodTypes([]); setActiveDiet([]); setActiveDifficulty(null); setActiveCuisine([]); }}
                          sx={{ color: "#9ca3af", fontSize: "0.75rem" }}>✕ Clear all filters</Button>
                      </Box>
                    )}
                  </Box>
                )}
                {totalFilters > 0 && (
                  <Box px={3} pb={2} display="flex" flexWrap="wrap" gap={0.8} alignItems="center">
                    <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>Active filters:</Typography>
                    {[...activeCuisine, ...activeFoodTypes, ...activeDiet, ...(activeDifficulty ? [activeDifficulty] : [])].map(f => (
                      <Chip key={f} label={f} size="small" sx={{ background: "#fef2f2", color: "#ef4444", border: "1px solid #fca5a5", fontWeight: 600, fontSize: "0.72rem", height: 22 }} />
                    ))}
                  </Box>
                )}
              </Box>

              <GenerateBtn onClick={generateRecipes} loading={recipeLoading} disabled={!ingredients.length} label="✨ Generate Recipes" />
              <div id="results-anchor" />

              {/* Skeleton loaders while loading */}
              {recipeLoading && (
                <>
                  <SectionHeader accent="lock" icon={<LockIcon sx={{ color: "#f97316", fontSize: 22 }} />} title="🔒 Cook With Exactly What You Have" subtitle="Generating strict recipes…" />
                  <Grid container spacing={2.5}>{[1,2,3].map(i => <Grid item xs={12} sm={6} md={4} key={i}><SkeletonCard /></Grid>)}</Grid>
                  <SectionHeader accent="bolt" icon={<BoltIcon sx={{ color: "#22c55e", fontSize: 22 }} />} title="⚡ Expand Your Options" subtitle="Generating flexible recipes…" />
                  <Grid container spacing={2.5}>{[1,2,3].map(i => <Grid item xs={12} sm={6} md={4} key={i}><SkeletonCard /></Grid>)}</Grid>
                </>
              )}

              {!recipeLoading && (recipes.strict.length > 0 || recipes.flexible.length > 0) && (
                <>
                  <SectionHeader accent="lock" icon={<LockIcon sx={{ color: "#f97316", fontSize: 22 }} />} title="🔒 Cook With Exactly What You Have" subtitle="Recipes use only the exact ingredients & quantities you listed — no extras, no pantry assumptions" />
                  <Grid container spacing={2.5}>
                    {recipes.strict.map((r, i) => (
                      <Grid item xs={12} sm={6} md={4} key={i}>
                        <Card sx={cardSx}>
                          <Box onClick={() => fetchDetails(r.title)}>
                            <Box sx={{ position: "relative", height: 160, overflow: "hidden" }}>
                              <RecipeImage title={r.title} height={160} />
                              <Box sx={badgeSx("rgba(249,115,22,0.92)")}>🔒 EXACT MATCH</Box>
                            </Box>
                            <CardContent sx={{ p: 2, pb: 1 }}>
                              <Typography fontWeight={700} fontSize="0.93rem" color="#1a1a1a" mb={0.5}>{r.title}</Typography>
                              <Typography variant="body2" color="text.secondary" fontSize="0.82rem">{r.preview}</Typography>
                            </CardContent>
                          </Box>
                          <Box px={2} pb={1.5} display="flex" alignItems="center" justifyContent="space-between" onClick={e => e.stopPropagation()}>
                            <StarRating value={recipeRatings[r.title] || 0} onChange={(v) => setRating(r.title, v)} size={16} />
                            {(recipeRatings[r.title] || 0) > 0 && (
                              <Typography variant="caption" color="#f59e0b" fontWeight={700} fontSize="0.65rem">{recipeRatings[r.title]}/5 ⭐</Typography>
                            )}
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  <SectionHeader accent="bolt" icon={<BoltIcon sx={{ color: "#22c55e", fontSize: 22 }} />} title="⚡ Expand Your Options" subtitle="Your ingredients as the base — plus extra items needed. Food type & diet filters strictly applied" />
                  <Grid container spacing={2.5}>
                    {recipes.flexible.map((r, i) => (
                      <Grid item xs={12} sm={6} md={4} key={i}>
                        <Card sx={cardSx}>
                          <Box onClick={() => fetchDetails(r.title)}>
                            <Box sx={{ position: "relative", height: 160, overflow: "hidden" }}>
                              <RecipeImage title={r.title} height={160} />
                              <Box sx={badgeSx("rgba(34,197,94,0.92)")}>⚡ EXPANDED</Box>
                            </Box>
                            <CardContent sx={{ p: 2, pb: 1 }}>
                              <Typography fontWeight={700} fontSize="0.93rem" color="#1a1a1a" mb={0.5}>{r.title}</Typography>
                              <Typography variant="body2" color="text.secondary" fontSize="0.82rem" mb={1}>{r.preview}</Typography>
                              {r.missing_ingredients?.length > 0 && (
                                <Box>
                                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.64rem" }}>You'll also need:</Typography>
                                  <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
                                    {r.missing_ingredients.map((m, idx) => (
                                      <Chip key={idx} label={[m.qty, m.unit, m.name].filter(Boolean).join(" ")} size="small"
                                        sx={{ background: "#f0fdf4", color: "#15803d", border: "1px solid #86efac", fontWeight: 600, fontSize: "0.71rem", height: 22 }} />
                                    ))}
                                  </Box>
                                </Box>
                              )}
                            </CardContent>
                          </Box>
                          {r.missing_ingredients?.length > 0 && (
                            <Box px={2} pb={1}>
                              <Button size="small" startIcon={<ShoppingCartIcon sx={{ fontSize: 14 }} />}
                                onClick={() => openFlexibleShoppingList(r)}
                                sx={{ color: "#15803d", fontSize: "0.75rem", background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 1.5, py: 0.3 }}>
                                Shopping List
                              </Button>
                            </Box>
                          )}
                          <Box px={2} pb={1.5} display="flex" alignItems="center" justifyContent="space-between" onClick={e => e.stopPropagation()}>
                            <StarRating value={recipeRatings[r.title] || 0} onChange={(v) => setRating(r.title, v)} size={16} />
                            {(recipeRatings[r.title] || 0) > 0 && (
                              <Typography variant="caption" color="#f59e0b" fontWeight={700} fontSize="0.65rem">{recipeRatings[r.title]}/5 ⭐</Typography>
                            )}
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}

              {/* Divider */}
              <Box my={5} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, #f97316, transparent)" }} />
                <Box sx={{ px: 2.5, py: 0.8, background: "linear-gradient(135deg, #7c2d12, #9a3412)", borderRadius: "100px", border: "1px solid rgba(249,115,22,0.4)", boxShadow: "0 4px 16px rgba(249,115,22,0.2)" }}>
                  <Typography sx={{ color: "#fdba74", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>✦ Or Generate by Name</Typography>
                </Box>
                <Box sx={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, #f97316, transparent)" }} />
              </Box>

              {/* Generate by name */}
              <Box sx={{ background: "linear-gradient(135deg, #fff7ed 0%, #fff 60%)", borderRadius: 4, border: "1.5px solid #fed7aa", boxShadow: "0 4px 24px rgba(249,115,22,0.08)", overflow: "hidden", mb: 3 }}>
                <Box sx={{ background: "linear-gradient(135deg, #1c0a02, #3b1208)", px: 3, py: 2.5, display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ width: 38, height: 38, borderRadius: 2, background: "rgba(249,115,22,0.25)", border: "1px solid rgba(249,115,22,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>🔎</Box>
                  <Box>
                    <Typography sx={{ fontWeight: 800, color: "#fff", fontSize: "1rem", lineHeight: 1.2 }}>Generate a Specific Recipe</Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem", mt: 0.2 }}>Name any dish — filters apply strictly. Say "Ramen" + Japanese + Easy and get a filter-compliant version.</Typography>
                  </Box>
                </Box>
                <Box p={3}>
                  {totalFilters > 0 && (
                    <Box mb={2.5} px={2} py={1.2} sx={{ background: "#fef2f2", borderRadius: 2, border: "1px solid #fca5a5", display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: "#ef4444", mr: 0.5 }}>🎯 Active filters will be applied:</Typography>
                      {[...activeCuisine, ...activeFoodTypes, ...activeDiet, ...(activeDifficulty ? [activeDifficulty] : [])].map(f => (
                        <Chip key={f} label={f} size="small" sx={{ background: "#fff5f5", color: "#ef4444", border: "1px solid #fca5a5", fontWeight: 600, fontSize: "0.7rem", height: 20 }} />
                      ))}
                    </Box>
                  )}
                  <Box display="flex" gap={1.5} alignItems="flex-start" flexWrap="wrap">
                    <TextField value={recipeNameInput} onChange={e => setRecipeNameInput(e.target.value)} onKeyDown={e => e.key === "Enter" && generateByName()}
                      placeholder="e.g. Mayonnaise, Pad Thai, Tiramisu, Butter Chicken…" size="small"
                      sx={{ flex: "1 1 260px", "& .MuiOutlinedInput-root": { borderRadius: 2, background: "#fff" } }}
                      InputProps={{
                        startAdornment: <Box component="span" sx={{ mr: 1, fontSize: "1rem" }}>🍽️</Box>,
                        endAdornment: recipeNameInput ? (<IconButton size="small" onClick={() => { setRecipeNameInput(""); setRecipeByName(null); }} sx={{ p: 0.3 }}><CloseIcon sx={{ fontSize: 15, color: "#9ca3af" }} /></IconButton>) : null,
                      }} />
                    <Button variant="contained" onClick={generateByName} disabled={recipeByNameLoading || !recipeNameInput.trim()}
                      sx={{ background: "linear-gradient(135deg, #f97316, #ef4444)", borderRadius: 2, fontWeight: 700, height: 40, boxShadow: "0 4px 14px rgba(239,68,68,0.3)", "&:hover": { boxShadow: "0 6px 20px rgba(239,68,68,0.45)" }, whiteSpace: "nowrap" }}>
                      {recipeByNameLoading ? <Box display="flex" alignItems="center" gap={1}><CircularProgress size={16} sx={{ color: "#fff" }} /><span>Generating…</span></Box> : "✨ Generate Recipe"}
                    </Button>
                  </Box>
                  <Box mt={1.5} display="flex" flexWrap="wrap" gap={0.8}>
                    {["Mayonnaise","Pad Thai","Tiramisu","Ramen","Guacamole","Pancakes","Biryani","Hummus"].map(s => (
                      <Box key={s} onClick={() => setRecipeNameInput(s)} sx={{
                        px: 1.4, py: 0.4, borderRadius: "20px", cursor: "pointer",
                        background: recipeNameInput === s ? "#fff7ed" : "#f9fafb",
                        border: `1px solid ${recipeNameInput === s ? "#f97316" : "#e5e7eb"}`,
                        color: recipeNameInput === s ? "#c2410c" : "#6b7280",
                        fontSize: "0.75rem", fontWeight: 600, transition: "all 0.15s",
                        "&:hover": { borderColor: "#f97316", color: "#c2410c", background: "#fff7ed" },
                      }}>{s}</Box>
                    ))}
                  </Box>
                </Box>
              </Box>

              <div id="byname-anchor" />

              {/* Recipe by name result */}
              {recipeByNameLoading && (
                <Box sx={{ background: "#fff", borderRadius: 4, border: "1.5px solid #fed7aa", overflow: "hidden", mb: 4 }}>
                  <Box sx={{ height: 220, ...shimmerSx }} />
                  <Box p={3}><Box sx={{ height: 20, width: "60%", borderRadius: 1, mb: 2, ...shimmerSx }} /><Box sx={{ height: 14, width: "90%", borderRadius: 1, mb: 1, ...shimmerSx }} /></Box>
                </Box>
              )}

              {recipeByName && !recipeByNameLoading && (
                <Box sx={{ background: "#fff", borderRadius: 4, border: "1.5px solid #fed7aa", boxShadow: "0 8px 32px rgba(249,115,22,0.12)", overflow: "hidden", mb: 4 }}>
                  <Box sx={{ position: "relative", height: 220, overflow: "hidden" }}>
                    <RecipeImage title={recipeByName._title} height={220} />
                    <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)" }} />
                    {recipeByName.filter_notes && (
                      <Box sx={{ position: "absolute", top: 12, left: 12, background: "rgba(239,68,68,0.9)", backdropFilter: "blur(8px)", borderRadius: "8px", px: 1.5, py: 0.5, border: "1px solid rgba(255,255,255,0.2)" }}>
                        <Typography sx={{ color: "#fff", fontSize: "0.7rem", fontWeight: 700 }}>🎯 {recipeByName.filter_notes}</Typography>
                      </Box>
                    )}
                    {recipeByName.difficulty_label && (
                      <Box sx={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", borderRadius: "8px", px: 1.5, py: 0.5 }}>
                        <Typography sx={{ color: "#fff", fontSize: "0.7rem", fontWeight: 700 }}>
                          {recipeByName.difficulty_label === "Easy" ? "🟢" : recipeByName.difficulty_label === "Medium" ? "🟡" : "🔴"} {recipeByName.difficulty_label}
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ position: "absolute", bottom: 16, left: 20, right: 20 }}>
                      <Typography sx={{ fontWeight: 900, fontSize: "1.6rem", color: "#fff", letterSpacing: "-0.5px", lineHeight: 1.1, textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>{recipeByName._title}</Typography>
                    </Box>
                  </Box>
                  <Box p={3}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2} mb={3}>
                      <Box display="flex" gap={1.5} flexWrap="wrap">
                        {[{ icon: "🍽️", val: recipeByName.servings, label: "Servings" }, { icon: "⏱️", val: recipeByName.prep_time, label: "Prep" }, { icon: "🔥", val: recipeByName.cook_time, label: "Cook" }].filter(m => m.val).map((m, i) => (
                          <Box key={i} sx={{ background: "#fff7ed", borderRadius: 2, px: 2, py: 1, border: "1px solid #fed7aa", textAlign: "center" }}>
                            <Typography fontSize="1.1rem">{m.icon}</Typography>
                            <Typography fontWeight={700} fontSize="0.85rem">{m.val}</Typography>
                            <Typography variant="caption" color="text.secondary">{m.label}</Typography>
                          </Box>
                        ))}
                      </Box>
                      <Button variant="outlined" startIcon={<BookmarkBorderIcon />}
                        onClick={() => {
                          if (savedRecipes.find(r => r._title === recipeByName._title)) { showToast("Already saved!", "error"); return; }
                          const updated = [...savedRecipes, recipeByName];
                          setSavedRecipes(updated);
                          localStorage.setItem("savedRecipes", JSON.stringify(updated));
                          showToast(`"${recipeByName._title}" saved! 📖`, "success");
                        }}
                        sx={{ borderColor: "#f97316", color: "#f97316", borderRadius: 2, fontWeight: 700, "&:hover": { background: "#fff7ed", borderColor: "#ea580c" } }}>
                        Save Recipe
                      </Button>
                      <Box display="flex" alignItems="center" gap={1} onClick={e => e.stopPropagation()}>
                        <StarRating
                          value={recipeRatings[recipeByName._title] || 0}
                          onChange={(v) => setRating(recipeByName._title, v)}
                          size={20}
                        />
                        {(recipeRatings[recipeByName._title] || 0) > 0 && (
                          <Typography variant="caption" color="#f59e0b" fontWeight={700}>{recipeRatings[recipeByName._title]}/5</Typography>
                        )}
                      </Box>
                    </Box>
                    {/* ── Audio Player ── */}
                    <RecipeAudioPlayer recipe={recipeByName} language={language} />

                    <Box mb={3} p={2} sx={{ background: "#fff7ed", borderRadius: 2, border: "1px solid #fed7aa" }}>
                      <Typography fontWeight={800} fontSize="0.8rem" color="#c2410c" mb={0.5} sx={{ textTransform: "uppercase", letterSpacing: "0.06em" }}>Overview</Typography>
                      <Typography color="#374151" fontSize="0.92rem" lineHeight={1.6}>{recipeByName.overview}</Typography>
                    </Box>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={5}>
                        <Typography variant="h6" fontWeight={800} mb={1.5} color="#1a1a1a">🧂 Ingredients</Typography>
                        <Box component="ul" sx={{ pl: 2, m: 0 }}>
                          {recipeByName.ingredients?.main?.map((ing, idx) => (
                            <Box component="li" key={idx} sx={{ mb: 0.8 }}>
                              <Typography fontSize="0.9rem" color="#374151">
                                <Box component="span" fontWeight={600}>{ing.quantity}</Box> {ing.name}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={7}>
                        <Typography variant="h6" fontWeight={800} mb={1.5} color="#1a1a1a">👨‍🍳 Instructions</Typography>
                        <Box>
                          {recipeByName.steps?.map((s, idx) => (
                            <Box key={idx} display="flex" gap={1.5} mb={1.5}>
                              <Box sx={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg, #f97316, #ef4444)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.72rem", fontWeight: 800, mt: 0.1 }}>{idx + 1}</Box>
                              <Typography fontSize="0.9rem" color="#374151" lineHeight={1.6}>{typeof s === "string" ? s : s.text}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </Grid>
                    </Grid>
                    {recipeByName.nutrition && (
                      <Box mt={3} pt={3} sx={{ borderTop: "1px solid #f3f4f6" }}>
                        <Typography fontWeight={800} mb={1.5} color="#1a1a1a">📊 Nutrition (per serving)</Typography>
                        <Box display="flex" gap={1.5} flexWrap="wrap">
                          {[
                            { label: "Calories", val: recipeByName.nutrition.calories, bg: "#fff7ed", border: "#fed7aa", color: "#c2410c" },
                            { label: "Protein",  val: recipeByName.nutrition.protein,  bg: "#f0fdf4", border: "#86efac", color: "#15803d" },
                            { label: "Carbs",    val: recipeByName.nutrition.carbs,    bg: "#eff6ff", border: "#93c5fd", color: "#1d4ed8" },
                            { label: "Fat",      val: recipeByName.nutrition.fat,      bg: "#fdf4ff", border: "#d8b4fe", color: "#7e22ce" },
                          ].filter(n => n.val).map((n, i) => (
                            <Box key={i} sx={{ background: n.bg, border: `1px solid ${n.border}`, borderRadius: 2, px: 2, py: 1, textAlign: "center", minWidth: 80 }}>
                              <Typography fontWeight={800} fontSize="1rem" color={n.color}>{n.val}</Typography>
                              <Typography variant="caption" color="text.secondary">{n.label}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        )}

        {/* ══ MEAL PLANNER ══ */}
        {page === "planner" && (
          <Box sx={{ minHeight: "100vh", background: "linear-gradient(160deg, #f0f9ff 0%, #e0f2fe 45%, #f0f9ff 100%)", position: "relative", overflow: "hidden" }}>
            <Box sx={{ position: "fixed", top: 60, right: -80, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.11) 0%, transparent 70%)", filter: "blur(50px)", pointerEvents: "none", zIndex: 0 }} />
            <Box sx={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.3, backgroundImage: "radial-gradient(circle, #3b82f6 1px, transparent 1px)", backgroundSize: "36px 36px" }} />

            <Box sx={{ position: "relative", zIndex: 1, overflow: "hidden", background: "linear-gradient(125deg, #03071e 0%, #06245c 40%, #0a3580 70%, #1d4ed8 100%)", px: { xs: 4, md: 6 }, py: 4.5 }}>
              <Box sx={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "repeating-linear-gradient(135deg, #60a5fa 0px, #60a5fa 1px, transparent 1px, transparent 18px)" }} />
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Box display="flex" alignItems="flex-start" justifyContent="space-between" flexWrap="wrap" gap={2}>
                  <Box>
                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, background: "rgba(96,165,250,0.2)", border: "1px solid rgba(96,165,250,0.4)", borderRadius: "100px", px: 2, py: 0.5, mb: 2 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "#60a5fa", boxShadow: "0 0 6px #60a5fa" }} />
                      <Typography sx={{ color: "#93c5fd", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>AI Meal Planner</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 900, fontSize: { xs: "1.8rem", md: "2.4rem" }, letterSpacing: "-1.5px", color: "#fff", lineHeight: 1.1, mb: 1 }}>📅 Meal Planner</Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem", maxWidth: 520 }}>Generate 5-day meal plans with shopping list and nutrition analysis</Typography>
                  </Box>
                  <Box sx={{ mt: 0.5 }}>
                    <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", mb: 0.8 }}>
                      Plan Language
                    </Typography>
                    <LanguagePill value={language} onChange={setLanguage} accentColor="#3b82f6" accentBg="#eff6ff" />
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box p={4} maxWidth={1000} mx="auto" sx={{ position: "relative", zIndex: 1 }}>
              <Tabs value={mpTab} onChange={(_, v) => setMpTab(v)} sx={{
                mb: 3, background: "#fff", borderRadius: 3, border: "1px solid #f3f4f6",
                "& .MuiTab-root": { fontWeight: 700, fontSize: "0.85rem", textTransform: "none", py: 1.8 },
                "& .MuiTabs-indicator": { background: "#3b82f6" },
              }}>
                <Tab label="🧺 Cook from Selection" />
                <Tab label="🗄️ Full Pantry Plan" />
              </Tabs>

              {/* ── Tab 1: Pick specific items from pantry ── */}
              {mpTab === 0 && (
                <Box>
                  {/* Explain */}
                  <Box sx={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 3, px: 3, py: 2, mb: 3, display: "flex", gap: 2, alignItems: "flex-start" }}>
                    <Typography fontSize="1.3rem" flexShrink={0}>🧺</Typography>
                    <Box>
                      <Typography fontWeight={700} color="#1d4ed8" fontSize="0.92rem">Cook from a selection</Typography>
                      <Typography color="#3b82f6" fontSize="0.82rem" mt={0.3}>
                        Tick the specific pantry items you want to cook with today. Only the checked items will be used to generate your meal plan.
                      </Typography>
                    </Box>
                  </Box>

                  {/* Pantry item checklist */}
                  <Box sx={{ background: "#fff", borderRadius: 3, border: "1px solid #f3f4f6", overflow: "hidden", mb: 2 }}>
                    <Box px={3} py={1.8} sx={{ background: "#f9fafb", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
                      <Typography fontWeight={700} color="#374151" fontSize="0.9rem">
                        Select items from My Pantry
                        {mpSelectedPantryIdxs.length > 0 && (
                          <Box component="span" sx={{ ml: 1.5, background: "#3b82f6", color: "#fff", borderRadius: "10px", px: 1, py: 0.1, fontSize: "0.7rem", fontWeight: 800 }}>
                            {mpSelectedPantryIdxs.length} selected
                          </Box>
                        )}
                      </Typography>
                      <Box display="flex" gap={1} alignItems="center">
                        {/* Voice select: speak item name → auto-checks matching pantry item */}
                        <Tooltip title="Say an ingredient name to select it" arrow>
                          <Box display="flex" alignItems="center" gap={0.5} sx={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 2, px: 1.2, py: 0.4 }}>
                            <MicButton
                              size={16}
                              onResult={(spoken) => {
                                const spokenLower = spoken.toLowerCase().trim();
                                const matchIdx = pantryItems.findIndex(
                                  item => item.inStock && item.name.toLowerCase().includes(spokenLower)
                                );
                                if (matchIdx !== -1) {
                                  setMpSelectedPantryIdxs(prev =>
                                    prev.includes(matchIdx) ? prev : [...prev, matchIdx]
                                  );
                                  showToast(`✓ Selected "${pantryItems[matchIdx].name}"`, "success");
                                } else {
                                  showToast(`"${spoken}" not found in pantry — add it in My Pantry first`, "error");
                                }
                              }}
                            />
                            <Typography variant="caption" color="#3b82f6" fontWeight={700} fontSize="0.68rem">Voice select</Typography>
                          </Box>
                        </Tooltip>
                        {/* Image scan — adds newly found items to pantry then selects them */}
                        <Tooltip title="Scan a photo to add & select ingredients" arrow>
                          <Box display="flex" alignItems="center" gap={0.5} sx={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 2, px: 1.2, py: 0.4 }}>
                            <ImageScanButton
                              accentColor="#3b82f6"
                              onConfirm={(items) => {
                                setPantryItems(prev => {
                                  const newItems = items.map(i => ({ ...i, inStock: true }));
                                  const updated = [...prev, ...newItems];
                                  // auto-select the newly added indices
                                  const newIdxs = newItems.map((_, j) => prev.length + j);
                                  setMpSelectedPantryIdxs(sel => [...sel, ...newIdxs]);
                                  return updated;
                                });
                                showToast(`📷 Added ${items.length} item${items.length !== 1 ? "s" : ""} to pantry & selected`, "success");
                              }}
                            />
                            <Typography variant="caption" color="#3b82f6" fontWeight={700} fontSize="0.68rem">Photo add</Typography>
                          </Box>
                        </Tooltip>
                        {mpSelectedPantryIdxs.length > 0 && (
                          <Button size="small" onClick={() => setMpSelectedPantryIdxs([])} sx={{ color: "#9ca3af", fontSize: "0.72rem" }}>Deselect all</Button>
                        )}
                        {pantryItems.filter(i => i.inStock).length > 0 && (
                          <Button size="small" onClick={() => setMpSelectedPantryIdxs(pantryItems.map((_, i) => i).filter(i => pantryItems[i].inStock))}
                            sx={{ color: "#3b82f6", fontSize: "0.72rem" }}>Select all</Button>
                        )}
                      </Box>
                    </Box>

                    {pantryItems.filter(i => i.inStock).length === 0 ? (
                      <Box py={5} textAlign="center">
                        <Typography fontSize="2rem" mb={1}>🗄️</Typography>
                        <Typography fontWeight={600} color="#374151" mb={0.5}>Your pantry is empty</Typography>
                        <Typography variant="body2" color="text.secondary" mb={2}>Add items in My Pantry first, then come back to select what to cook with.</Typography>
                        <Button variant="outlined" size="small" onClick={() => setPage("pantry")}
                          sx={{ borderColor: "#3b82f6", color: "#3b82f6", borderRadius: 2, fontWeight: 700 }}>
                          Go to My Pantry →
                        </Button>
                      </Box>
                    ) : (
                      pantryItems.map((item, idx) => {
                        if (!item.inStock) return null;
                        const checked = mpSelectedPantryIdxs.includes(idx);
                        return (
                          <Box key={idx}
                            onClick={() => setMpSelectedPantryIdxs(prev =>
                              checked ? prev.filter(i => i !== idx) : [...prev, idx]
                            )}
                            sx={{
                              px: 3, py: 1.4, display: "flex", alignItems: "center", gap: 2,
                              borderBottom: "1px solid #f9fafb", cursor: "pointer",
                              background: checked ? "#eff6ff" : "transparent",
                              transition: "background 0.15s",
                              "&:hover": { background: checked ? "#dbeafe" : "#f9fafb" },
                            }}>
                            <Box sx={{
                              width: 20, height: 20, borderRadius: 1, flexShrink: 0,
                              border: `2px solid ${checked ? "#3b82f6" : "#d1d5db"}`,
                              background: checked ? "#3b82f6" : "#fff",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              transition: "all 0.15s",
                            }}>
                              {checked && <Typography sx={{ color: "#fff", fontSize: "0.72rem", fontWeight: 900, lineHeight: 1 }}>✓</Typography>}
                            </Box>
                            <Typography fontSize="0.9rem" color="#374151" flex={1}>
                              <Box component="span" fontWeight={700}>{[item.qty, item.unit].filter(Boolean).join(" ")}</Box>
                              {" "}{item.name}
                            </Typography>
                            {checked && (
                              <Chip label="Selected" size="small" sx={{ background: "#dbeafe", color: "#1d4ed8", border: "1px solid #bfdbfe", fontWeight: 700, fontSize: "0.68rem", height: 20 }} />
                            )}
                          </Box>
                        );
                      })
                    )}
                  </Box>

                  {mpSelectedPantryIdxs.length > 0 && (
                    <Box mb={2} px={2} py={1.5} sx={{ background: "#f0fdf4", borderRadius: 2, border: "1px solid #86efac", display: "flex", flexWrap: "wrap", gap: 0.8, alignItems: "center" }}>
                      <Typography variant="caption" fontWeight={700} color="#15803d" mr={0.5}>Cooking with:</Typography>
                      {mpSelectedPantryIdxs.map(idx => (
                        <Chip key={idx}
                          label={[pantryItems[idx]?.qty, pantryItems[idx]?.unit, pantryItems[idx]?.name].filter(Boolean).join(" ")}
                          size="small"
                          sx={{ background: "#dcfce7", color: "#15803d", border: "1px solid #86efac", fontWeight: 600, fontSize: "0.72rem", height: 22 }} />
                      ))}
                    </Box>
                  )}

                  <FiltersPanel
                    activeFoodTypes={mpPantryFoodTypes} setActiveFoodTypes={setMpPantryFoodTypes}
                    activeDiet={mpPantryDiet} setActiveDiet={setMpPantryDiet}
                    activeDifficulty={mpPantryDifficulty} setActiveDifficulty={setMpPantryDifficulty}
                    activeCuisine={mpPantryCuisine} setActiveCuisine={setMpPantryCuisine}
                    subtitle="applied to all 5 days"
                  />
                  <GenerateBtn onClick={generatePantryPlan} loading={mpPantryLoading} disabled={!mpSelectedPantryIdxs.length} label="🧺 Generate Plan from Selection" />
                  <div id="pantry-plan-anchor" />
                  <MealPlanGrid plan={mpPantryPlan} onViewRecipe={fetchDetails} recipeRatings={recipeRatings} onRate={setRating} />
                  {mpPantryPlan.length > 0 && (
                    <>
 <Box mt={3} display="flex" gap={1.5} flexWrap="wrap" alignItems="center">
  <Button startIcon={<ShoppingCartIcon />} variant="outlined"
    onClick={() => openShoppingList(mpPantryPlan, "Selection Plan Shopping List")}
    sx={{ borderColor: "#3b82f6", color: "#3b82f6", borderRadius: 2, fontWeight: 700, "&:hover": { background: "#eff6ff" } }}>
    Shopping List
  </Button>
  <Button startIcon={<DownloadIcon />} variant="outlined"
    onClick={() => exportMealPlanPDF(mpPantryPlan, "Pantry Selection Meal Plan")}
    sx={{ borderColor: "#22c55e", color: "#15803d", borderRadius: 2, fontWeight: 700, "&:hover": { background: "#f0fdf4" } }}>
    Download PDF
  </Button>
</Box>
                      <NutritionDashboard plan={mpPantryPlan} />
                    </>
                  )}
                </Box>
              )}

              {/* ── Tab 2: Full Pantry Plan (all in-stock items) ── */}
              {mpTab === 1 && (
                <Box>
                  {/* Explain */}
                  <Box sx={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 3, px: 3, py: 2, mb: 3, display: "flex", gap: 2, alignItems: "flex-start" }}>
                    <Typography fontSize="1.3rem" flexShrink={0}>🗄️</Typography>
                    <Box flex={1}>
                      <Typography fontWeight={700} color="#c2410c" fontSize="0.92rem">Full Pantry Plan</Typography>
                      <Typography color="#ea580c" fontSize="0.82rem" mt={0.3}>
                        Uses <strong>everything currently in stock</strong> in your pantry to generate the most comprehensive 5-day meal plan. Keep your pantry updated and regenerate anytime.
                      </Typography>
                    </Box>
                    <Button size="small" variant="outlined" onClick={() => setPage("pantry")}
                      sx={{ borderColor: "#f97316", color: "#f97316", borderRadius: 2, fontWeight: 700, fontSize: "0.72rem", flexShrink: 0, "&:hover": { background: "#fff7ed" } }}>
                      Update Pantry →
                    </Button>
                  </Box>

                  {/* Live pantry snapshot */}
                  <Box sx={{ background: "#fff", borderRadius: 3, border: "1px solid #f3f4f6", overflow: "hidden", mb: 2 }}>
                    <Box px={3} py={1.8} sx={{ background: "#f9fafb", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Typography fontWeight={700} color="#374151" fontSize="0.9rem">
                        Current pantry snapshot
                        <Box component="span" sx={{ ml: 1.5, background: pantryItems.filter(i => i.inStock).length > 0 ? "#f97316" : "#d1d5db", color: "#fff", borderRadius: "10px", px: 1, py: 0.1, fontSize: "0.7rem", fontWeight: 800 }}>
                          {pantryItems.filter(i => i.inStock).length} in stock
                        </Box>
                      </Typography>
                      <Typography variant="caption" color="text.secondary" fontSize="0.72rem">auto-updated from My Pantry</Typography>
                    </Box>

                    {pantryItems.filter(i => i.inStock).length === 0 ? (
                      <Box py={5} textAlign="center">
                        <Typography fontSize="2rem" mb={1}>🗄️</Typography>
                        <Typography fontWeight={600} color="#374151" mb={0.5}>Pantry is empty</Typography>
                        <Typography variant="body2" color="text.secondary" mb={2}>Add and track items in My Pantry. This tab will automatically pick them all up.</Typography>
                        <Button variant="outlined" size="small" onClick={() => setPage("pantry")}
                          sx={{ borderColor: "#f97316", color: "#f97316", borderRadius: 2, fontWeight: 700 }}>
                          Go to My Pantry →
                        </Button>
                      </Box>
                    ) : (
                      <Box display="flex" flexWrap="wrap" gap={1} p={2.5}>
                        {pantryItems.filter(i => i.inStock).map((item, idx) => (
                          <Chip key={idx}
                            label={[item.qty, item.unit, item.name].filter(Boolean).join(" ")}
                            sx={{ background: "#fff7ed", color: "#c2410c", border: "1px solid #fed7aa", fontWeight: 600, fontSize: "0.78rem" }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>

                  <FiltersPanel
                    activeFoodTypes={mpGroceryFoodTypes} setActiveFoodTypes={setMpGroceryFoodTypes}
                    activeDiet={mpGroceryDiet} setActiveDiet={setMpGroceryDiet}
                    activeDifficulty={mpGroceryDifficulty} setActiveDifficulty={setMpGroceryDifficulty}
                    activeCuisine={mpGroceryCuisine} setActiveCuisine={setMpGroceryCuisine}
                    subtitle="applied to all 5 days"
                  />
                  <GenerateBtn onClick={generateGroceryPlan} loading={mpGroceryLoading} disabled={pantryItems.filter(i => i.inStock).length === 0} label="🗄️ Generate Full Pantry Plan" />
                  <div id="grocery-plan-anchor" />
                  <MealPlanGrid plan={mpGroceryPlan} onViewRecipe={fetchDetails} recipeRatings={recipeRatings} onRate={setRating} />
                  {mpGroceryPlan.length > 0 && (
                    <>
 <Box mt={3} display="flex" gap={1.5} flexWrap="wrap" alignItems="center">
  <Button startIcon={<ShoppingCartIcon />} variant="outlined"
    onClick={() => openShoppingList(mpGroceryPlan, "Full Pantry Plan Shopping List")}
    sx={{ borderColor: "#3b82f6", color: "#3b82f6", borderRadius: 2, fontWeight: 700, "&:hover": { background: "#eff6ff" } }}>
    Shopping List
  </Button>
  <Button startIcon={<DownloadIcon />} variant="outlined"
    onClick={() => exportMealPlanPDF(mpGroceryPlan, "Full Pantry Meal Plan")}
    sx={{ borderColor: "#22c55e", color: "#15803d", borderRadius: 2, fontWeight: 700, "&:hover": { background: "#f0fdf4" } }}>
    Download PDF
  </Button>
</Box>
                      <NutritionDashboard plan={mpGroceryPlan} />
                    </>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        )}

        {/* ══ MY PANTRY ══ */}
        {page === "pantry" && (
          <Box sx={{ minHeight: "100vh", background: "linear-gradient(160deg, #fff7ed 0%, #fef3e2 45%, #fffbeb 100%)", position: "relative", overflow: "hidden" }}>
            <Box sx={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.35, backgroundImage: "radial-gradient(circle, #f97316 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
            <Box sx={{ position: "relative", zIndex: 1, overflow: "hidden", background: "linear-gradient(125deg, #431407 0%, #7c2d12 50%, #92400e 100%)", px: { xs: 4, md: 6 }, py: 4.5 }}>
              <Box sx={{ position: "relative", zIndex: 1, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 3 }}>
                <Box>
                  <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, background: "rgba(251,191,36,0.2)", border: "1px solid rgba(251,191,36,0.4)", borderRadius: "100px", px: 2, py: 0.5, mb: 2 }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "#fbbf24" }} />
                    <Typography sx={{ color: "#fde68a", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Pantry Manager</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 900, fontSize: { xs: "1.8rem", md: "2.4rem" }, letterSpacing: "-1.5px", color: "#fff", lineHeight: 1.1, mb: 1 }}>🗄️ My Pantry</Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem" }}>
                    {pantryItems.length} items · {pantryItems.filter(i => i.inStock).length} in stock
                  </Typography>
                </Box>
                <Box display="flex" alignItems="flex-end" gap={2} flexWrap="wrap">
                  {/* Language selector */}
                  <Box>
                    <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", mb: 0.8 }}>
                      Recipe Language
                    </Typography>
                    <LanguagePill value={language} onChange={setLanguage} accentColor="#f97316" accentBg="#fff7ed" />
                  </Box>
                  {pantryItems.some(i => i.inStock) && (
                    <Button variant="contained" onClick={importPantryToGenerator}
                      sx={{ background: "linear-gradient(135deg, #f97316, #ef4444)", borderRadius: 2, fontWeight: 700, boxShadow: "0 4px 16px rgba(239,68,68,0.3)" }}>
                      🍳 Use in Recipe Generator
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>

            <Box p={4} maxWidth={800} mx="auto" sx={{ position: "relative", zIndex: 1 }}>
              {/* Add item */}
              <Box sx={{ background: "#fff", borderRadius: 3, p: 3, border: "1px solid #f3f4f6", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", mb: 3 }}>
                <Typography fontWeight={700} mb={2} color="#374151">Add to Pantry</Typography>
                <Box display="flex" gap={1.5} flexWrap="wrap" alignItems="flex-start">
                  <TextField label="Item name" value={pantryInputName} onChange={e => setPantryInputName(e.target.value)} onKeyDown={e => e.key === "Enter" && addPantryItem()}
                    placeholder="e.g. olive oil" size="small" sx={{ flex: "1 1 150px", minWidth: 130 }} />
                  <TextField label="Qty" type="number" value={pantryInputQty} onChange={e => setPantryInputQty(e.target.value)} onKeyDown={e => e.key === "Enter" && addPantryItem()}
                    placeholder="1" size="small" inputProps={{ min: 0, step: "any" }} sx={{ width: 80 }} />
                  <FormControl size="small" sx={{ minWidth: 110 }}>
                    <InputLabel>Unit</InputLabel>
                    <Select value={pantryInputUnit} label="Unit" onChange={e => setPantryInputUnit(e.target.value)}>
                      {UNITS.map(u => <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <Button variant="contained" onClick={addPantryItem} startIcon={<AddCircleOutlineIcon />}
                    sx={{ background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: 2, fontWeight: 700, height: 40, boxShadow: "none" }}>
                    Add
                  </Button>
                  <MicButton onResult={(t) => setPantryInputName(prev => prev ? prev + " " + t : t)} />
                  {/* Image scan — adds directly to pantry items */}
                  <ImageScanButton
                    accentColor="#f97316"
                    onConfirm={(items) =>
                      setPantryItems(prev => [...prev, ...items.map(i => ({ ...i, inStock: true }))])
                    }
                  />
                </Box>
              </Box>

              {/* Pantry list */}
              {pantryItems.length === 0 ? (
                <EmptyStateIllustration
                  type="pantry"
                  message="Your pantry is empty"
                  subMessage="Add ingredients above to keep track of what you have. Check items off as you use them."
                />
              ) : (
                <Box sx={{ background: "#fff", borderRadius: 3, border: "1px solid #f3f4f6", overflow: "hidden" }}>
                  <Box px={3} py={2} sx={{ background: "#f9fafb", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography fontWeight={700} color="#374151">
                      Pantry Items ({pantryItems.filter(i => i.inStock).length}/{pantryItems.length} in stock)
                    </Typography>
                    <Button size="small" onClick={() => setPantryItems([])} sx={{ color: "#ef4444", fontSize: "0.75rem" }}>Clear all</Button>
                  </Box>

                  {/* In stock */}
                  {pantryItems.filter(i => i.inStock).length > 0 && (
                    <Box>
                      <Box px={3} py={1} sx={{ background: "#f0fdf4", borderBottom: "1px solid #dcfce7", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography variant="caption" fontWeight={800} color="#15803d" sx={{ textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.65rem" }}>✅ In Stock</Typography>
                        <Typography variant="caption" color="#6b7280" fontSize="0.62rem">tap − to consume, + to restock</Typography>
                      </Box>
                      {pantryItems.map((item, idx) => !item.inStock ? null : (
                        <Box key={idx} sx={{ px: 3, py: 1.5, display: "flex", alignItems: "center", gap: 2, borderBottom: "1px solid #f9fafb", "&:hover": { background: "#fafafa" } }}>
                          <IconButton size="small" onClick={() => togglePantryItem(idx)} sx={{ color: "#22c55e", p: 0.3, flexShrink: 0 }}>
                            <CheckBoxIcon sx={{ fontSize: 22 }} />
                          </IconButton>

                          {/* Item name */}
                          <Typography fontSize="0.9rem" color="#374151" fontWeight={600} flex={1}>
                            {item.name}
                            {item.unit && <Box component="span" color="#9ca3af" fontWeight={400} fontSize="0.78rem"> ({item.unit})</Box>}
                          </Typography>

                          {/* Quantity stepper */}
                          <Box display="flex" alignItems="center" gap={0.5} sx={{ background: "#f9fafb", borderRadius: 2, border: "1px solid #e5e7eb", px: 0.5, py: 0.3 }}>
                            <IconButton
                              size="small"
                              onClick={() => updatePantryQty(idx, -1)}
                              sx={{ width: 26, height: 26, borderRadius: 1.5, background: "#fef2f2", color: "#ef4444", fontWeight: 800, fontSize: "1rem", "&:hover": { background: "#fee2e2" } }}
                            >−</IconButton>
                            <TextField
                              value={item.qty || "0"}
                              onChange={e => setPantryQtyDirect(idx, e.target.value)}
                              size="small"
                              inputProps={{ min: 0, step: "any", style: { textAlign: "center", fontWeight: 700, fontSize: "0.88rem", padding: "2px 0", width: 38 } }}
                              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1, "& fieldset": { border: "none" } }, "& .MuiOutlinedInput-input": { px: 0.5 } }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => updatePantryQty(idx, 1)}
                              sx={{ width: 26, height: 26, borderRadius: 1.5, background: "#f0fdf4", color: "#22c55e", fontWeight: 800, fontSize: "1rem", "&:hover": { background: "#dcfce7" } }}
                            >+</IconButton>
                          </Box>

                          <IconButton size="small" onClick={() => removePantryItem(idx)} sx={{ color: "#d1d5db", flexShrink: 0, "&:hover": { color: "#ef4444" } }}>
                            <DeleteIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}

                  {/* Out of stock */}
                  {pantryItems.filter(i => !i.inStock).length > 0 && (
                    <Box>
                      <Box px={3} py={1} sx={{ background: "#fef2f2", borderBottom: "1px solid #fee2e2", borderTop: "1px solid #f3f4f6" }}>
                        <Typography variant="caption" fontWeight={800} color="#ef4444" sx={{ textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.65rem" }}>❌ Used Up / Out of Stock</Typography>
                      </Box>
                      {pantryItems.map((item, idx) => item.inStock ? null : (
                        <Box key={idx} sx={{ px: 3, py: 1.5, display: "flex", alignItems: "center", gap: 2, borderBottom: "1px solid #f9fafb", opacity: 0.5, "&:hover": { background: "#fafafa", opacity: 0.7 } }}>
                          <IconButton size="small" onClick={() => togglePantryItem(idx)} sx={{ color: "#d1d5db", p: 0.3 }}>
                            <CheckBoxOutlineBlankIcon sx={{ fontSize: 22 }} />
                          </IconButton>
                          <Typography fontSize="0.9rem" color="#9ca3af" flex={1} sx={{ textDecoration: "line-through" }}>
                            {[item.qty, item.unit, item.name].filter(Boolean).join(" ")}
                          </Typography>
                          <IconButton size="small" onClick={() => removePantryItem(idx)} sx={{ color: "#d1d5db", "&:hover": { color: "#ef4444" } }}>
                            <DeleteIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        )}

        {/* ══ SAVED RECIPES ══ */}
        {page === "saved" && (() => {
          const MEAT_KEYWORDS = ["chicken","beef","pork","lamb","turkey","fish","salmon","tuna","shrimp","bacon","sausage","steak","mutton","crab","lobster","meat","ham","pepperoni","prawn","anchovy","sardine","duck","venison"];
          const isVeg = (r) => !MEAT_KEYWORDS.some(k => ((r._title || "") + " " + (r.overview || "")).toLowerCase().includes(k));

          const filtered = savedRecipes.filter(r => {
            const q = savedSearch.toLowerCase();
            const matchesSearch = !q || r._title?.toLowerCase().includes(q) || r.overview?.toLowerCase().includes(q);
            const matchesVeg = savedVegFilter === "all" || (savedVegFilter === "veg" ? isVeg(r) : !isVeg(r));
            return matchesSearch && matchesVeg;
          });

          const vegCount = savedRecipes.filter(r => isVeg(r)).length;
          const nonVegCount = savedRecipes.length - vegCount;

          return (
            <Box sx={{ minHeight: "100vh", background: "linear-gradient(160deg, #f0fdf4 0%, #ecfdf5 45%, #f0fdfa 100%)", position: "relative", overflow: "hidden" }}>
              <Box sx={{ position: "fixed", top: 60, right: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.11) 0%, transparent 70%)", filter: "blur(50px)", pointerEvents: "none", zIndex: 0 }} />
              <Box sx={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.3, backgroundImage: "radial-gradient(circle, #059669 1.5px, transparent 1.5px)", backgroundSize: "36px 36px" }} />

              <Box sx={{ position: "relative", zIndex: 1, overflow: "hidden", background: "linear-gradient(125deg, #022c22 0%, #064e3b 40%, #065f46 70%, #047857 100%)", px: { xs: 4, md: 6 }, py: 4.5 }}>
                <Box sx={{ position: "relative", zIndex: 1, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 3 }}>
                  <Box>
                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, background: "rgba(52,211,153,0.2)", border: "1px solid rgba(52,211,153,0.4)", borderRadius: "100px", px: 2, py: 0.5, mb: 2 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 6px #34d399" }} />
                      <Typography sx={{ color: "#6ee7b7", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Your Cookbook</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 900, fontSize: { xs: "1.8rem", md: "2.4rem" }, letterSpacing: "-1.5px", color: "#fff", lineHeight: 1.1, mb: 1 }}>💾 Saved Recipes</Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem" }}>
                      {savedRecipes.length} recipe{savedRecipes.length !== 1 ? "s" : ""} saved
                      {(savedSearch || savedVegFilter !== "all") && ` · ${filtered.length} shown`}
                    </Typography>
                  </Box>
                  {savedRecipes.length > 0 && (
                    <TextField value={savedSearch} onChange={e => setSavedSearch(e.target.value)} placeholder="Search saved recipes…" size="small"
                      sx={{ width: 260, mb: 0.5, "& .MuiOutlinedInput-root": { background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", borderRadius: 2, color: "#fff", "& fieldset": { borderColor: "rgba(255,255,255,0.2)" }, "&.Mui-focused fieldset": { borderColor: "#34d399" } }, "& .MuiInputBase-input::placeholder": { color: "rgba(255,255,255,0.4)", opacity: 1 } }}
                      InputProps={{
                        startAdornment: <Box component="span" sx={{ mr: 1, fontSize: "1rem" }}>🔍</Box>,
                        endAdornment: savedSearch ? (<IconButton size="small" onClick={() => setSavedSearch("")} sx={{ p: 0.3 }}><CloseIcon sx={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }} /></IconButton>) : null,
                      }} />
                  )}
                </Box>
              </Box>

              <Box p={4} maxWidth={960} mx="auto" sx={{ position: "relative", zIndex: 1 }}>

                {/* Veg / Non-veg filter bar */}
                {savedRecipes.length > 0 && (
                  <Box display="flex" gap={1} mb={3} sx={{ background: "#fff", borderRadius: 3, p: 1, border: "1px solid #bbf7d0", width: "fit-content" }}>
                    {[
                      { key: "all",    label: "🍽️ All",          count: savedRecipes.length },
                      { key: "veg",    label: "🌱 Vegetarian",   count: vegCount },
                      { key: "nonveg", label: "🥩 Non-Veg",      count: nonVegCount },
                    ].map(opt => (
                      <Box key={opt.key} onClick={() => setSavedVegFilter(opt.key)} sx={{
                        px: 2, py: 0.8, borderRadius: 2, cursor: "pointer",
                        background: savedVegFilter === opt.key ? "linear-gradient(135deg, #22c55e, #16a34a)" : "transparent",
                        color: savedVegFilter === opt.key ? "#fff" : "#6b7280",
                        fontWeight: 700, fontSize: "0.82rem", transition: "all 0.18s",
                        display: "flex", alignItems: "center", gap: 0.8,
                      }}>
                        {opt.label}
                        <Box sx={{
                          background: savedVegFilter === opt.key ? "rgba(255,255,255,0.3)" : "#f3f4f6",
                          color: savedVegFilter === opt.key ? "#fff" : "#9ca3af",
                          borderRadius: "10px", px: 0.8, fontSize: "0.65rem", fontWeight: 800,
                        }}>{opt.count}</Box>
                      </Box>
                    ))}
                  </Box>
                )}

                {savedRecipes.length === 0 ? (
                  <EmptyStateIllustration
                    type="saved"
                    message="No saved recipes yet"
                    subMessage="Generate some recipes and save your favorites here. You can rate them and add personal cooking notes."
                    action={
                      <Button variant="contained" onClick={() => setPage("recipes")} sx={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", borderRadius: 2, fontWeight: 700 }}>
                        Generate Recipes →
                      </Button>
                    }
                  />
                ) : filtered.length === 0 ? (
                  <EmptyStateIllustration
                    type="search"
                    message={savedSearch ? `No results for "${savedSearch}"` : `No ${savedVegFilter === "veg" ? "vegetarian" : "non-veg"} recipes saved`}
                    subMessage={savedSearch ? "Try a different search term." : "Try a different filter or save more recipes."}
                    action={
                      <Button size="small" onClick={() => { setSavedSearch(""); setSavedVegFilter("all"); }} sx={{ color: "#22c55e" }}>
                        Clear filters
                      </Button>
                    }
                  />
                ) : (
                  <Grid container spacing={2.5}>
                    {filtered.map((r, i) => {
                      const originalIdx = savedRecipes.indexOf(r);
                      const recipeName = r._title || "";
                      const rating = recipeRatings[recipeName] || 0;
                      const note = recipeNotes[recipeName] || "";
                      return (
                        <Grid item xs={12} sm={6} md={4} key={i}>
                          <Card sx={{ ...cardSx, display: "flex", flexDirection: "column" }}>
                            <IconButton onClick={() => deleteRecipe(originalIdx)} size="small" sx={{
                              position: "absolute", right: 8, top: 8, zIndex: 1,
                              background: "rgba(255,255,255,0.9)", backdropFilter: "blur(4px)",
                              "&:hover": { background: "#fee2e2", color: "#ef4444" },
                            }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>

                            <Box onClick={() => { setDetails(r); setOpen(true); setServingMultiplier(1); }}>
                              <Box sx={{ position: "relative", height: 150, overflow: "hidden" }}>
                                <RecipeImage title={recipeName || "food meal"} height={150} />
                                {/* Veg/Non-veg badge */}
                                <Box sx={{ position: "absolute", bottom: 8, left: 8, background: isVeg(r) ? "rgba(22,163,74,0.9)" : "rgba(220,38,38,0.9)", backdropFilter: "blur(4px)", borderRadius: "6px", px: 1, py: 0.25, fontSize: "0.62rem", fontWeight: 800, color: "#fff" }}>
                                  {isVeg(r) ? "🌱 VEG" : "🥩 NON-VEG"}
                                </Box>
                              </Box>
                              <CardContent sx={{ p: 2, pb: 1 }}>
                                {recipeName && (
                                  <Typography fontWeight={800} fontSize="0.95rem" color="#1a1a1a" mb={0.5} lineHeight={1.3}>{recipeName}</Typography>
                                )}
                                <Typography fontSize="0.8rem" color="text.secondary" lineHeight={1.4} sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                  {r.overview}
                                </Typography>
                                {(r.servings || r.cook_time) && (
                                  <Box display="flex" gap={0.8} mt={1} flexWrap="wrap">
                                    {r.servings && <Box sx={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 1.5, px: 1, py: 0.2 }}><Typography variant="caption" color="#c2410c" fontWeight={700} fontSize="0.7rem">🍽️ {r.servings}</Typography></Box>}
                                    {r.cook_time && <Box sx={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 1.5, px: 1, py: 0.2 }}><Typography variant="caption" color="#1d4ed8" fontWeight={700} fontSize="0.7rem">⏱️ {r.cook_time}</Typography></Box>}
                                  </Box>
                                )}
                              </CardContent>
                            </Box>

                            {/* Rating + Note */}
                            <Box px={2} pb={2} mt="auto">
                              <Divider sx={{ mb: 1.5 }} />
                              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                                <StarRating value={rating} onChange={(v) => setRating(recipeName, v)} size={18} />
                                <Typography variant="caption" color="text.disabled" fontSize="0.65rem">
                                  {rating > 0 ? `${rating}/5 ⭐` : "Rate this"}
                                </Typography>
                              </Box>
                              {editingNote === recipeName ? (
                                <Box>
                                  <TextField
                                    multiline rows={2} fullWidth size="small" autoFocus
                                    defaultValue={note}
                                    placeholder="Add cooking notes…"
                                    sx={{ "& .MuiOutlinedInput-root": { fontSize: "0.8rem", borderRadius: 1.5 } }}
                                    onBlur={(e) => saveNote(recipeName, e.target.value)}
                                    onKeyDown={(e) => e.key === "Escape" && setEditingNote(null)}
                                  />
                                  <Typography variant="caption" color="text.disabled" sx={{ fontSize: "0.65rem" }}>Press Escape to cancel, click away to save</Typography>
                                </Box>
                              ) : (
                                <Box onClick={() => setEditingNote(recipeName)} sx={{ cursor: "pointer", p: 1, borderRadius: 1, border: "1px dashed #e5e7eb", "&:hover": { borderColor: "#22c55e", background: "#f0fdf4" }, minHeight: 32 }}>
                                  {note ? (
                                    <Typography fontSize="0.78rem" color="#374151" lineHeight={1.5}>{note}</Typography>
                                  ) : (
                                    <Typography fontSize="0.75rem" color="#d1d5db">+ Add cooking notes…</Typography>
                                  )}
                                </Box>
                              )}
                            </Box>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </Box>
            </Box>
          );
        })()}

        {/* ══ TOP RATED ══ */}
        {page === "toprated" && (() => {
          const MEAT_KEYWORDS = ["chicken","beef","pork","lamb","turkey","fish","salmon","tuna","shrimp","bacon","sausage","steak","mutton","crab","lobster","meat","ham","pepperoni","prawn","anchovy","sardine","duck","venison"];
          const isVeg = (title, overview = "") => {
            const text = (title + " " + overview).toLowerCase();
            return !MEAT_KEYWORDS.some(k => text.includes(k));
          };

          const ratedTitles = Object.keys(recipeRatings).filter(t => recipeRatings[t] > 0);

          // Enrich with saved recipe data if available
          const enriched = ratedTitles.map(title => {
            const saved = savedRecipes.find(r => r._title === title);
            return {
              title,
              rating: recipeRatings[title],
              overview: saved?.overview || "",
              servings: saved?.servings,
              cook_time: saved?.cook_time,
              veg: isVeg(title, saved?.overview || ""),
            };
          }).sort((a, b) => b.rating - a.rating);

          const filtered = enriched.filter(r => {
            if (trFilter === "veg") return r.veg;
            if (trFilter === "nonveg") return !r.veg;
            return true;
          });

          return (
            <Box sx={{ minHeight: "100vh", background: "linear-gradient(160deg, #fffbeb 0%, #fef3c7 45%, #fffde7 100%)", position: "relative", overflow: "hidden" }}>
              <Box sx={{ position: "fixed", top: 60, right: -80, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.13) 0%, transparent 70%)", filter: "blur(50px)", pointerEvents: "none", zIndex: 0 }} />
              <Box sx={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.25, backgroundImage: "radial-gradient(circle, #f59e0b 1px, transparent 1px)", backgroundSize: "36px 36px" }} />

              {/* Header */}
              <Box sx={{ position: "relative", zIndex: 1, overflow: "hidden", background: "linear-gradient(125deg, #1c0a02 0%, #451a03 40%, #78350f 70%, #92400e 100%)", px: { xs: 4, md: 6 }, py: 4.5 }}>
                <Box sx={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "repeating-linear-gradient(135deg, #fbbf24 0px, #fbbf24 1px, transparent 1px, transparent 18px)" }} />
                <Box sx={{ position: "relative", zIndex: 1 }}>
                  <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, background: "rgba(251,191,36,0.2)", border: "1px solid rgba(251,191,36,0.4)", borderRadius: "100px", px: 2, py: 0.5, mb: 2 }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "#fbbf24", boxShadow: "0 0 6px #fbbf24" }} />
                    <Typography sx={{ color: "#fde68a", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Your Reviews</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 900, fontSize: { xs: "1.8rem", md: "2.4rem" }, letterSpacing: "-1.5px", color: "#fff", lineHeight: 1.1, mb: 1 }}>⭐ Top Rated Recipes</Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem" }}>
                    {ratedTitles.length} rated recipe{ratedTitles.length !== 1 ? "s" : ""} · sorted by your ratings
                  </Typography>
                </Box>
              </Box>

              <Box p={4} maxWidth={960} mx="auto" sx={{ position: "relative", zIndex: 1 }}>

                {/* Filter toggle */}
                <Box display="flex" gap={1} mb={3} sx={{ background: "#fff", borderRadius: 3, p: 1, border: "1px solid #fde68a", width: "fit-content" }}>
                  {[
                    { key: "all", label: "🍽️ All", count: enriched.length },
                    { key: "veg", label: "🌱 Vegetarian", count: enriched.filter(r => r.veg).length },
                    { key: "nonveg", label: "🥩 Non-Veg", count: enriched.filter(r => !r.veg).length },
                  ].map(opt => (
                    <Box key={opt.key} onClick={() => setTrFilter(opt.key)} sx={{
                      px: 2, py: 0.8, borderRadius: 2, cursor: "pointer",
                      background: trFilter === opt.key ? "linear-gradient(135deg, #f59e0b, #d97706)" : "transparent",
                      color: trFilter === opt.key ? "#fff" : "#6b7280",
                      fontWeight: 700, fontSize: "0.82rem", transition: "all 0.18s",
                      display: "flex", alignItems: "center", gap: 0.8,
                    }}>
                      {opt.label}
                      <Box sx={{
                        background: trFilter === opt.key ? "rgba(255,255,255,0.3)" : "#f3f4f6",
                        color: trFilter === opt.key ? "#fff" : "#9ca3af",
                        borderRadius: "10px", px: 0.8, fontSize: "0.65rem", fontWeight: 800,
                      }}>{opt.count}</Box>
                    </Box>
                  ))}
                </Box>

                {ratedTitles.length === 0 ? (
                  <Box textAlign="center" py={10}>
                    <Typography fontSize="3rem" mb={2}>⭐</Typography>
                    <Typography fontWeight={700} fontSize="1rem" color="#374151" mb={1}>No rated recipes yet</Typography>
                    <Typography variant="body2" color="text.secondary" mb={3} maxWidth={340} mx="auto">
                      Rate recipes in the Recipe Generator or Meal Planner — they'll appear here sorted by your stars.
                    </Typography>
                    <Button variant="contained" onClick={() => setPage("recipes")}
                      sx={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", borderRadius: 2, fontWeight: 700 }}>
                      Generate Recipes →
                    </Button>
                  </Box>
                ) : filtered.length === 0 ? (
                  <Box textAlign="center" py={8}>
                    <Typography fontSize="2rem" mb={1}>{trFilter === "veg" ? "🌱" : "🥩"}</Typography>
                    <Typography fontWeight={700} color="#374151">No {trFilter === "veg" ? "vegetarian" : "non-veg"} rated recipes</Typography>
                    <Button size="small" onClick={() => setTrFilter("all")} sx={{ mt: 1, color: "#f59e0b" }}>Show all</Button>
                  </Box>
                ) : (
                  <Grid container spacing={2.5}>
                    {filtered.map((r, i) => (
                      <Grid item xs={12} sm={6} md={4} key={r.title}>
                        <Card sx={{ ...cardSx, "&:hover": { transform: "translateY(-4px)", boxShadow: "0 8px 24px rgba(245,158,11,0.18)", borderColor: "#fde68a" } }}>
                          <Box onClick={() => fetchDetails(r.title)}>
                            <Box sx={{ position: "relative", height: 155, overflow: "hidden" }}>
                              <RecipeImage title={r.title} height={155} />
                              {/* Rank badge */}
                              {i < 3 && (
                                <Box sx={{ position: "absolute", top: 10, left: 10, background: i === 0 ? "#f59e0b" : i === 1 ? "#9ca3af" : "#b45309", color: "#fff", borderRadius: "8px", px: 1.2, py: 0.4, fontSize: "0.7rem", fontWeight: 800 }}>
                                  {i === 0 ? "🥇 #1" : i === 1 ? "🥈 #2" : "🥉 #3"}
                                </Box>
                              )}
                              {/* Veg badge */}
                              <Box sx={{ position: "absolute", top: 10, right: 10, background: r.veg ? "rgba(22,163,74,0.88)" : "rgba(220,38,38,0.88)", backdropFilter: "blur(4px)", borderRadius: "8px", px: 1.1, py: 0.3, fontSize: "0.66rem", fontWeight: 800, color: "#fff" }}>
                                {r.veg ? "🌱 VEG" : "🥩 NON-VEG"}
                              </Box>
                              <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)" }} />
                            </Box>
                            <CardContent sx={{ p: 2, pb: 1 }}>
                              <Typography fontWeight={800} fontSize="0.95rem" color="#1a1a1a" mb={0.5} lineHeight={1.3}>{r.title}</Typography>
                              {r.overview && (
                                <Typography variant="body2" color="text.secondary" fontSize="0.8rem" sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                  {r.overview}
                                </Typography>
                              )}
                            </CardContent>
                          </Box>
                          <Box px={2} pb={1.5} display="flex" alignItems="center" justifyContent="space-between" onClick={e => e.stopPropagation()}>
                            <StarRating value={r.rating} onChange={(v) => setRating(r.title, v)} size={18} />
                            <Typography variant="caption" color="#f59e0b" fontWeight={800} fontSize="0.72rem">{r.rating}/5 ⭐</Typography>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            </Box>
          );
        })()}

        {/* ── RECIPE DETAILS MODAL ── */}
        <Dialog open={open} onClose={() => { setOpen(false); setDetails(null); window.speechSynthesis?.cancel(); }}
          fullWidth maxWidth="md"
          PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}>
          <DialogTitle sx={{
            background: "linear-gradient(135deg, #fff7ed, #fee2e2)",
            borderBottom: "1px solid #f3f4f6", fontWeight: 800, fontSize: "1.2rem",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <Typography fontWeight={800} fontSize="1.1rem">
              {details ? (details._title || "🍳 Recipe Details") : "Loading…"}
            </Typography>
            <Box display="flex" gap={1}>
              {details && (
                <Tooltip title="Cook Mode — fullscreen step-by-step">
                  <Button
                    variant="outlined" size="small" startIcon={<FullscreenIcon />}
                    onClick={() => { setOpen(false); setCookModeOpen(true); }}
                    sx={{ borderColor: "#f97316", color: "#f97316", borderRadius: 2, fontWeight: 700, fontSize: "0.78rem", "&:hover": { background: "#fff7ed" } }}>
                    Cook Mode
                  </Button>
                </Tooltip>
              )}
              <IconButton onClick={() => { setOpen(false); setDetails(null); }} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            {(detailsLoading && !details) && (
              <Box py={2}>
                <Box sx={{ height: 16, width: "60%", borderRadius: 1, mb: 2, ...shimmerSx }} />
                <Box sx={{ height: 12, width: "90%", borderRadius: 1, mb: 1, ...shimmerSx }} />
                <Box sx={{ height: 12, width: "75%", borderRadius: 1, mb: 3, ...shimmerSx }} />
                {[1,2,3].map(i => <Box key={i} sx={{ height: 12, width: `${60 + i * 10}%`, borderRadius: 1, mb: 1, ...shimmerSx }} />)}
              </Box>
            )}
            {details && (
              <>
                {/* Action bar */}
                <Box display="flex" gap={1.5} flexWrap="wrap" mb={3} alignItems="center">
                  <Button variant="contained" startIcon={<BookmarkBorderIcon />} onClick={saveRecipe}
                    sx={{ background: "linear-gradient(135deg, #ef4444, #f97316)", borderRadius: 2, fontWeight: 700, boxShadow: "none" }}>
                    Save Recipe
                  </Button>
                  <Button variant="outlined" size="small" startIcon={<FullscreenIcon />}
                    onClick={() => { setOpen(false); setCookModeOpen(true); }}
                    sx={{ borderColor: "#f97316", color: "#f97316", borderRadius: 2, fontWeight: 600 }}>
                    Cook Mode
                  </Button>
                </Box>

                {/* Meta row */}
                <Box display="flex" gap={2} flexWrap="wrap" mb={3} alignItems="center">
                  {[
                    { icon: "🍽️", val: details.servings, label: "Servings" },
                    { icon: "⏱️", val: details.prep_time, label: "Prep" },
                    { icon: "🔥", val: details.cook_time, label: "Cook" },
                  ].filter(m => m.val).map((m, i) => (
                    <Box key={i} sx={{ background: "#fff7ed", borderRadius: 2, px: 2, py: 1, border: "1px solid #fed7aa", textAlign: "center" }}>
                      <Typography fontSize="1.2rem">{m.icon}</Typography>
                      <Typography fontWeight={700} fontSize="0.85rem">{m.val}</Typography>
                      <Typography variant="caption" color="text.secondary">{m.label}</Typography>
                    </Box>
                  ))}

                  {/* Serving multiplier */}
                  <Box sx={{ background: "#f0fdf4", borderRadius: 2, px: 2, py: 1, border: "1px solid #86efac", display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                    <Box>
                      <Typography variant="caption" fontWeight={700} color="#15803d" display="block" lineHeight={1.2}>Adjust Servings</Typography>
                      <Typography variant="caption" color="#6b7280" fontSize="0.64rem">multiplies all ingredient amounts</Typography>
                    </Box>
                    {[1, 2, 3, 4].map(m => (
                      <Box key={m} onClick={() => setServingMultiplier(m)} sx={{
                        width: 34, height: 34, borderRadius: "50%", cursor: "pointer",
                        background: servingMultiplier === m ? "#22c55e" : "#fff",
                        border: `1.5px solid ${servingMultiplier === m ? "#22c55e" : "#d1d5db"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.78rem", fontWeight: 800,
                        color: servingMultiplier === m ? "#fff" : "#374151",
                        transition: "all 0.15s",
                        flexShrink: 0,
                      }}>×{m}</Box>
                    ))}
                  </Box>
                </Box>

                {/* ── Audio Player ── */}
                <RecipeAudioPlayer recipe={details} language={language} />

                <Typography variant="h6" fontWeight={800} mb={1}>Overview</Typography>
                <Typography mb={3} color="text.secondary">{details.overview}</Typography>

                <Typography variant="h6" fontWeight={800} mb={1}>Ingredients</Typography>
                <Box component="ul" sx={{ pl: 2, mb: 3 }}>
                  {details.ingredients?.main?.map((ing, idx) => (
                    <Box component="li" key={idx} sx={{ mb: 0.8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Typography fontSize="0.9rem">
                        {scaleQty(ing.quantity, servingMultiplier)} {ing.name}
                      </Typography>
                      <Tooltip title={`Substitute ${ing.name}`}>
                        <IconButton size="small" onClick={() => setSubModal({ open: true, ingredient: ing.name })}
                          sx={{ color: "#d1d5db", "&:hover": { color: "#f97316" }, p: 0.4 }}>
                          <SwapHorizIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ))}
                </Box>

                <Typography variant="h6" fontWeight={800} mb={1}>Steps</Typography>
                <Box component="ol" sx={{ pl: 2, mb: 3 }}>
                  {details.steps?.map((s, idx) => {
                    const stepText = typeof s === "string" ? s : s.text;
                    const stepTime = typeof s === "object" && s.time_min ? s.time_min : null;
                    return (
                      <Box component="li" key={idx} sx={{ mb: 1.5 }}>
                        <Box display="flex" alignItems="flex-start" gap={1}>
                          <Typography fontSize="0.9rem" flex={1}>{stepText}</Typography>
                          {stepTime && (
                            <Chip label={`⏱ ${stepTime}m`} size="small"
                              sx={{ background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe", fontWeight: 700, fontSize: "0.7rem", height: 20, flexShrink: 0 }} />
                          )}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>

                {details.nutrition && (
                  <>
                    <Typography variant="h6" fontWeight={800} mb={1.5}>Nutrition (per serving{servingMultiplier > 1 ? ` × ${servingMultiplier}` : ""})</Typography>
                    <Box display="flex" gap={1.5} flexWrap="wrap">
                      {[
                        { label: "Calories", val: details.nutrition.calories, bg: "#fff7ed", border: "#fed7aa", color: "#c2410c" },
                        { label: "Protein", val: details.nutrition.protein, bg: "#f0fdf4", border: "#86efac", color: "#15803d" },
                        { label: "Carbs", val: details.nutrition.carbs, bg: "#eff6ff", border: "#93c5fd", color: "#1d4ed8" },
                        { label: "Fat", val: details.nutrition.fat, bg: "#fdf4ff", border: "#d8b4fe", color: "#7e22ce" },
                      ].filter(n => n.val).map((n, i) => (
                        <Box key={i} sx={{ background: n.bg, border: `1px solid ${n.border}`, borderRadius: 2, px: 2, py: 1, textAlign: "center", minWidth: 80 }}>
                          <Typography fontWeight={800} fontSize="1rem" color={n.color}>{n.val}</Typography>
                          <Typography variant="caption" color="text.secondary">{n.label}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
}

// ─── IngredientInput (used in Meal Planner) ───────────────────────────────────
function IngredientInput({ onAdd, label = "Ingredient" }) {
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState("");
  const add = () => {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), qty: qty.trim(), unit });
    setName(""); setQty(""); setUnit("");
  };
  return (
    <Box display="flex" gap={1.5} flexWrap="wrap" alignItems="flex-start">
      <TextField label={label} value={name} onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === "Enter" && add()}
        placeholder="e.g. eggs" size="small" sx={{ flex: "1 1 150px", minWidth: 130 }} />
      <TextField label="Qty" type="number" value={qty} onChange={e => setQty(e.target.value)}
        onKeyDown={e => e.key === "Enter" && add()}
        placeholder="2" size="small" inputProps={{ min: 0, step: "any" }} sx={{ width: 80 }} />
      <FormControl size="small" sx={{ minWidth: 110 }}>
        <InputLabel>Unit</InputLabel>
        <Select value={unit} label="Unit" onChange={e => setUnit(e.target.value)}>
          {UNITS.map(u => <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>)}
        </Select>
      </FormControl>
      <Button variant="contained" onClick={add} startIcon={<AddCircleOutlineIcon />}
        sx={{ background: "linear-gradient(135deg, #ef4444, #f97316)", borderRadius: 2, fontWeight: 700, height: 40, boxShadow: "none", "&:hover": { boxShadow: "0 2px 12px rgba(239,68,68,0.3)" } }}>Add</Button>
      <MicButton onResult={(t) => setName(prev => prev ? prev + " " + t : t)} />
    </Box>
  );
}
