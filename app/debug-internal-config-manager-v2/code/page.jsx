"use client";
import React, { useState, useEffect } from "react";
import {
    Box, Typography, TextField, Button, Paper,
    ThemeProvider, createTheme, CssBaseline, List, ListItem,
    ListItemText, ListItemIcon, IconButton, Breadcrumbs, Link,
    Chip, Dialog, DialogTitle, DialogContent, DialogActions,
    Alert, CircularProgress, Divider
} from "@mui/material";
import {
    Lock, Folder, Description, Save, ArrowBack,
    ChevronRight, ExpandMore, Code, VpnKey, Warning
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

// Reusing the theme from the main CMS for consistency
const theme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#4f46e5' },
        secondary: { main: '#ec4899' },
        background: { default: '#ffffff', paper: '#ffffff' },
        text: { primary: '#1e293b', secondary: '#64748b' },
    },
    typography: {
        fontFamily: '"Inter", "system-ui", "-apple-system", sans-serif',
        h6: { fontWeight: 700 },
    },
    shape: { borderRadius: 4 },
    components: {
        MuiButton: {
            styleOverrides: {
                root: { textTransform: 'none', fontWeight: 600, borderRadius: 4 },
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: { boxShadow: 'none', border: '1px solid #e2e8f0' }
            }
        }
    }
});

const FileTreeNode = ({ name, path, type, level, onSelect, selectedPath, expandedPaths, toggleExpand }) => {
    const isDir = type === "dir";
    const fullPath = path ? `${path}/${name}` : name;
    const isExpanded = expandedPaths.has(fullPath);
    const isSelected = selectedPath === fullPath;

    // Fetch children if expanded
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isExpanded && isDir && children.length === 0) {
            setLoading(true);
            const secret = localStorage.getItem("cms_secret");
            fetch(`/api/admin/code?type=list&path=${encodeURIComponent(fullPath)}`, {
                headers: { "x-cms-secret": secret }
            })
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setChildren(data.sort((a, b) => {
                            if (a.type === b.type) return a.name.localeCompare(b.name);
                            return a.type === 'dir' ? -1 : 1;
                        }));
                    }
                })
                .finally(() => setLoading(false));
        }
    }, [isExpanded, isDir, fullPath]);

    const handleClick = (e) => {
        e.stopPropagation();
        if (isDir) {
            toggleExpand(fullPath);
        } else {
            onSelect(fullPath);
        }
    };

    return (
        <Box>
            <ListItem
                button
                onClick={handleClick}
                sx={{
                    pl: level * 2 + 2,
                    py: 0.5,
                    bgcolor: isSelected ? 'primary.light' : 'transparent',
                    color: isSelected ? 'primary.main' : 'text.primary',
                    '&:hover': { bgcolor: isSelected ? 'primary.light' : '#f1f5f9' },
                    borderLeft: isSelected ? '3px solid' : '3px solid transparent',
                    borderColor: 'primary.main'
                }}
            >
                <ListItemIcon sx={{ minWidth: 30, color: isSelected ? 'primary.main' : 'text.secondary' }}>
                    {isDir ? (isExpanded ? <ExpandMore fontSize="small" /> : <ChevronRight fontSize="small" />) : <Description fontSize="small" />}
                </ListItemIcon>
                <ListItemText
                    primary={name}
                    primaryTypographyProps={{ variant: 'body2', fontFamily: 'monospace', fontWeight: isSelected ? 600 : 400 }}
                />
            </ListItem>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                        {loading ? (
                            <Box sx={{ pl: level * 2 + 4, py: 1 }}>
                                <CircularProgress size={16} />
                            </Box>
                        ) : (
                            children.map(child => (
                                <FileTreeNode
                                    key={child.name}
                                    {...child}
                                    path={fullPath}
                                    level={level + 1}
                                    onSelect={onSelect}
                                    selectedPath={selectedPath}
                                    expandedPaths={expandedPaths}
                                    toggleExpand={toggleExpand}
                                />
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </Box>
    );
};

export default function CodeEditorPage() {
    const [secret, setSecret] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);

    // File Browser State
    const [rootItems, setRootItems] = useState([]);
    const [expandedPaths, setExpandedPaths] = useState(new Set());
    const [selectedPath, setSelectedPath] = useState(null);

    // Editor State
    const [fileContent, setFileContent] = useState("");
    const [originalContent, setOriginalContent] = useState("");
    const [isLoadingFile, setIsLoadingFile] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);

    useEffect(() => {
        const savedSecret = localStorage.getItem("cms_secret");
        if (savedSecret) {
            setSecret(savedSecret);
            validateSecret(savedSecret);
        }
    }, []);

    const [pin, setPin] = useState("");
    const [isPinVerified, setIsPinVerified] = useState(false);
    // ... existing state ...

    const validateSecret = async (key) => {
        try {
            const res = await fetch("/api/admin/code?type=list&path=", {
                headers: { "x-cms-secret": key }
            });
            if (res.ok) {
                const data = await res.json();
                setIsAuthorized(true);
                setRootItems(data);
                localStorage.setItem("cms_secret", key);
            } else {
                setIsAuthorized(false);
            }
        } catch (error) {
            setIsAuthorized(false);
        }
    };

    const handlePinSubmit = () => {
        if (pin == 9662) {
            setIsPinVerified(true);
        } else {
            alert("Invalid PIN");
            setPin("");
        }
    };

    const toggleExpand = (path) => {
        const newSet = new Set(expandedPaths);
        if (newSet.has(path)) {
            newSet.delete(path);
        } else {
            newSet.add(path);
        }
        setExpandedPaths(newSet);
    };

    const handleSelectFile = async (path) => {
        setSelectedPath(path);
        setIsLoadingFile(true);
        setIsEditing(false); // Reset editing mode
        try {
            const res = await fetch(`/api/admin/code?type=content&path=${encodeURIComponent(path)}`, {
                headers: { "x-cms-secret": secret }
            });
            const data = await res.json();
            if (res.ok) {
                setFileContent(data.content);
                setOriginalContent(data.content);
            } else {
                alert("Failed to load file: " + data.error);
                setFileContent("");
            }
        } catch (error) {
            alert("Error loading file");
        } finally {
            setIsLoadingFile(false);
        }
    };

    const handleSave = async () => {
        try {
            const res = await fetch("/api/admin/code", {
                method: "POST",
                headers: { "x-cms-secret": secret, "Content-Type": "application/json" },
                body: JSON.stringify({ path: selectedPath, content: fileContent })
            });
            if (res.ok) {
                setOriginalContent(fileContent);
                setIsEditing(false);
                setConfirmSaveOpen(false);
                alert("File saved successfully.");
            } else {
                const data = await res.json();
                alert("Error saving: " + data.error);
            }
        } catch (error) {
            alert("System error during save.");
        }
    };

    if (!isAuthorized) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box sx={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', zIndex: 1200 }}>
                    <Paper elevation={0} sx={{ p: 5, width: 440, textAlign: 'center', borderRadius: 6 }}>
                        <Box sx={{ bgcolor: 'secondary.light', width: 80, height: 80, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3, opacity: 0.8 }}>
                            <Lock sx={{ fontSize: 40, color: 'secondary.main' }} />
                        </Box>
                        <Typography variant="h5" sx={{ mb: 1 }}>Restricted Access</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                            Enter the Master Key to access system source code.
                        </Typography>
                        <TextField
                            fullWidth
                            label="Secret Key"
                            type="password"
                            value={secret}
                            onChange={(e) => setSecret(e.target.value)}
                            sx={{ mb: 3 }}
                        />
                        <Button fullWidth variant="contained" size="large" onClick={() => validateSecret(secret)} color="secondary">Decrypt & Access</Button>
                    </Paper>
                </Box>
            </ThemeProvider>
        );
    }

    if (!isPinVerified) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box sx={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', zIndex: 1200 }}>
                    <Paper elevation={0} sx={{ p: 5, width: 400, textAlign: 'center', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                        <Box sx={{ bgcolor: 'primary.light', width: 64, height: 64, borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3, opacity: 0.2 }}>
                            <VpnKey sx={{ fontSize: 32, color: 'primary.main' }} />
                        </Box>
                        <Typography variant="h6" sx={{ mb: 1 }}>Security Verification</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                            Enter the 4-digit security PIN to unlock the editor.
                        </Typography>
                        <TextField
                            fullWidth
                            autoFocus
                            placeholder="0000"
                            type="password"
                            inputProps={{ maxLength: 4, style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' } }}
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handlePinSubmit()}
                            sx={{ mb: 3 }}
                        />
                        <Button fullWidth variant="contained" size="large" onClick={handlePinSubmit}>Unlock Editor</Button>
                    </Paper>
                </Box>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{
                display: 'flex', height: '100vh', flexDirection: 'column', bgcolor: 'background.default'
                , position: 'fixed',
                top: 0,
                left: 0, right: 0
            }}>
                {/* Header */}
                <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'background.paper' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton href="/debug-internal-config-manager-v2" sx={{ mr: 1 }}><ArrowBack /></IconButton>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                            <Code sx={{ mr: 1, color: 'primary.main' }} /> Project Code Editor
                        </Typography>
                    </Box>
                    <Box>
                        <Chip icon={<VpnKey />} label="Privileged Mode" color="error" size="small" variant="outlined" />
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
                    {/* Sidebar - File Tree */}
                    <Box sx={{ width: 300, borderRight: '1px solid #e2e8f0', overflowY: 'auto', bgcolor: '#f8fafc' }}>
                        <List dense>
                            {rootItems.map(item => (
                                <FileTreeNode
                                    key={item.name}
                                    {...item}
                                    level={0}
                                    onSelect={handleSelectFile}
                                    selectedPath={selectedPath}
                                    expandedPaths={expandedPaths}
                                    toggleExpand={toggleExpand}
                                />
                            ))}
                        </List>
                    </Box>

                    {/* Main Editor */}
                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
                        {!selectedPath ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1, flexDirection: 'column', opacity: 0.5 }}>
                                <Description sx={{ fontSize: 64, mb: 2, color: 'text.secondary' }} />
                                <Typography>Select a file to view or edit</Typography>
                            </Box>
                        ) : (
                            <>
                                <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'background.paper' }}>
                                    <Breadcrumbs maxItems={3} aria-label="breadcrumb">
                                        <Typography color="inherit">Root</Typography>
                                        {selectedPath.split('/').map((part, i) => (
                                            <Typography key={i} color={i === selectedPath.split('/').length - 1 ? 'text.primary' : 'inherit'}>{part}</Typography>
                                        ))}
                                    </Breadcrumbs>
                                    <Box>
                                        {!isEditing ? (
                                            <Button variant="outlined" onClick={() => setIsEditing(true)} color="primary">Enable Editing</Button>
                                        ) : (
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button variant="text" onClick={() => { setIsEditing(false); setFileContent(originalContent); }}>Cancel</Button>
                                                <Button variant="contained" startIcon={<Save />} color="error" onClick={() => setConfirmSaveOpen(true)}>Save Changes</Button>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>

                                {isLoadingFile && <CircularProgress sx={{ m: 4 }} />}

                                <Box sx={{ flexGrow: 1, position: 'relative' }}>
                                    {isEditing && (
                                        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bgcolor: 'error.light', color: 'error.contrastText', px: 2, py: 0.5, fontSize: '0.75rem', zIndex: 10, textAlign: 'center' }}>
                                            CAUTION: You are editing live source code. Errors may break the application.
                                        </Box>
                                    )}
                                    <Box
                                        component="textarea"
                                        value={fileContent}
                                        onChange={(e) => setFileContent(e.target.value)}
                                        readOnly={!isEditing}
                                        spellCheck="false"
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            border: 'none',
                                            outline: 'none',
                                            p: 3,
                                            pt: isEditing ? 5 : 3, // Add padding for warning banner
                                            resize: 'none',
                                            bgcolor: isEditing ? '#ffffff' : '#f8fafc',
                                            fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
                                            fontSize: '0.9rem',
                                            lineHeight: 1.6,
                                            color: isEditing ? 'text.primary' : 'text.secondary',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </Box>
                            </>
                        )}
                    </Box>
                </Box>

                {/* Confirm Save Dialog */}
                <Dialog open={confirmSaveOpen} onClose={() => setConfirmSaveOpen(false)}>
                    <DialogTitle sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
                        <Warning sx={{ mr: 1 }} /> Confirm Source Code Write
                    </DialogTitle>
                    <DialogContent>
                        <Alert severity="error" sx={{ mb: 2 }}>
                            You are about to overwrite <b>{selectedPath}</b>.
                        </Alert>
                        <Typography variant="body2">
                            This action cannot be undone. Incorrect code can crash the server or break public pages.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmSaveOpen(false)}>Cancel</Button>
                        <Button variant="contained" color="error" onClick={handleSave}>Confirm Overwrite</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </ThemeProvider>
    );
}
