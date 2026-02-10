"use client";
import React, { useState, useEffect } from "react";
import {
    Box, Typography, TextField, Button, Paper,
    ThemeProvider, createTheme, CssBaseline, Tabs, Tab,
    Card, CardContent, Grid, IconButton, List, ListItem,
    ListItemText, ListItemSecondaryAction, Divider, Dialog,
    DialogTitle, DialogContent, DialogActions, Fab, Tooltip,
    Breadcrumbs, Link, Chip, Avatar
} from "@mui/material";
import {
    Lock, Add, Edit, Delete, Folder, Language,
    Description, Visibility, Save, Close, Refresh, Code,
    ChevronRight, ArrowBack, Storage, Public, VpnKey, CreateNewFolder,
    DeleteOutline, Launch, FileCopy
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

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
        h4: { fontWeight: 800, letterSpacing: '-0.02em' },
        h6: { fontWeight: 700 },
    },
    shape: { borderRadius: 4 },
    components: {
        MuiButton: {
            styleOverrides: {
                root: { textTransform: 'none', fontWeight: 600, px: 3, borderRadius: 4 },
                contained: { boxShadow: 'none', '&:hover': { boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' } },
            }
        },
        MuiCard: {
            styleOverrides: {
                root: { boxShadow: 'none', border: '1px solid #e2e8f0', borderRadius: 4 }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: { boxShadow: 'none', border: '1px solid #e2e8f0' }
            }
        }
    }
});

export default function CMSPage() {
    const [secret, setSecret] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [sites, setSites] = useState([]);
    const [selectedSite, setSelectedSite] = useState(null);
    const [assets, setAssets] = useState([]);
    const [editorContent, setEditorContent] = useState("");
    const [editingFile, setEditingFile] = useState(null);
    const [openSiteDialog, setOpenSiteDialog] = useState(false);
    const [openFileDialog, setOpenFileDialog] = useState(false);
    const [newSite, setNewSite] = useState({ id: "", folder: "", keys: {}, domains: [] });
    const [newFileName, setNewFileName] = useState("");

    useEffect(() => {
        const savedSecret = localStorage.getItem("cms_secret");
        if (savedSecret) {
            setSecret(savedSecret);
            validateSecret(savedSecret);
        }
    }, []);

    const validateSecret = async (key) => {
        try {
            const res = await fetch("/api/admin/sites", {
                headers: { "x-cms-secret": key }
            });
            if (res.ok) {
                setIsAuthorized(true);
                localStorage.setItem("cms_secret", key);
                fetchSites(key);
            } else {
                setIsAuthorized(false);
            }
        } catch (error) {
            setIsAuthorized(false);
        }
    };

    const fetchSites = async (key) => {
        const res = await fetch("/api/admin/sites", {
            headers: { "x-cms-secret": key }
        });
        const data = await res.json();
        setSites(data.sites || []);
    };

    const fetchAssets = async (folder) => {
        const res = await fetch(`/api/admin/assets?folder=${folder}`, {
            headers: { "x-cms-secret": secret }
        });
        const data = await res.json();
        setAssets(data.files || []);
    };

    const handleSaveSite = async () => {
        if (!newSite.id || !newSite.folder) {
            alert("ID and Folder name are required");
            return;
        }
        const res = await fetch("/api/admin/sites", {
            method: "POST",
            headers: { "x-cms-secret": secret, "Content-Type": "application/json" },
            body: JSON.stringify(newSite)
        });
        if (res.ok) {
            fetchSites(secret);
            setOpenSiteDialog(false);
            alert("Site configuration saved successfully.");
        } else {
            const err = await res.json();
            alert("Error: " + err.error);
        }
    };

    const handleCreateFile = async () => {
        if (!newFileName) {
            alert("Filename is required");
            return;
        }
        const res = await fetch("/api/admin/assets", {
            method: "POST",
            headers: { "x-cms-secret": secret, "Content-Type": "application/json" },
            body: JSON.stringify({ folder: selectedSite.folder, filename: newFileName })
        });
        if (res.ok) {
            fetchAssets(selectedSite.folder);
            setOpenFileDialog(false);
            setNewFileName("");
            alert("File created successfully.");
        } else {
            const err = await res.json();
            alert("Error: " + err.error);
        }
    };

    const handleDeleteFile = async (filename) => {
        if (!confirm(`Are you sure you want to delete ${filename}?`)) return;
        const res = await fetch(`/api/admin/assets?folder=${selectedSite.folder}&filename=${filename}`, {
            method: "DELETE",
            headers: { "x-cms-secret": secret }
        });
        if (res.ok) {
            fetchAssets(selectedSite.folder);
            if (editingFile === filename) setEditingFile(null);
        }
    };

    const handleEditFile = async (filename) => {
        const res = await fetch(`/api/admin/assets/${filename}?folder=${selectedSite.folder}`, {
            headers: { "x-cms-secret": secret }
        });
        const data = await res.json();
        setEditorContent(data.content || "");
        setEditingFile(filename);
    };

    const handleSaveFile = async () => {
        try {
            const res = await fetch(`/api/admin/assets/${editingFile}?folder=${selectedSite.folder}`, {
                method: "POST",
                headers: { "x-cms-secret": secret, "Content-Type": "application/json" },
                body: JSON.stringify({ content: editorContent })
            });
            if (res.ok) {
                setEditingFile(null);
                fetchAssets(selectedSite.folder);
                alert("File saved and deployed successfully.");
            } else {
                alert("Failed to save file.");
            }
        } catch (error) {
            alert("Error saving file: " + error.message);
        }
    };

    if (!isAuthorized) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', zIndex: 900 }}>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <Paper elevation={0} sx={{ p: 5, width: 440, textAlign: 'center', border: '1px solid #e2e8f0', borderRadius: 6 }}>
                            <Box sx={{ bgcolor: 'primary.light', width: 80, height: 80, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3, opacity: 0.8 }}>
                                <Lock sx={{ fontSize: 40, color: 'primary.main' }} />
                            </Box>
                            <Typography variant="h5" sx={{ mb: 1 }}>Management Console</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Please enter your administrative access key to continue.</Typography>
                            <TextField
                                fullWidth
                                label="Secret Key"
                                type="password"
                                value={secret}
                                onChange={(e) => setSecret(e.target.value)}
                                sx={{ mb: 3 }}
                                variant="outlined"
                            />
                            <Button fullWidth variant="contained" size="large" onClick={() => validateSecret(secret)} disableElevation>Unlock Dashboard</Button>
                        </Paper>
                    </motion.div>
                </Box>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', flexGrow: 1, bgcolor: 'background.default', zIndex: 900, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

                {/* Header */}
                <Box sx={{ py: 2, px: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', bgcolor: 'background.paper' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h6" sx={{ lineHeight: 1.2 }}>Procatalog</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button startIcon={<Refresh />} size="small" variant="outlined" color="inherit" onClick={() => fetchSites(secret)}>Sync</Button>
                        <Button startIcon={<Close />} size="small" variant="text" color="inherit" onClick={() => { setIsAuthorized(false); localStorage.removeItem("cms_secret"); }}>Logout</Button>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
                    {/* Sidebar / List */}
                    <Box sx={{ width: 280, borderRight: '1px solid #e2e8f0', bgcolor: 'background.paper', overflowY: 'auto' }}>
                        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="overline" sx={{ fontWeight: 800, color: 'text.secondary' }}>Sites & Projects</Typography>
                            <IconButton size="small" onClick={() => { setNewSite({ id: "", folder: "", keys: {}, domains: [] }); setOpenSiteDialog(true); }}><Add /></IconButton>
                        </Box>
                        <List sx={{ px: 1 }}>
                            {sites.map((site) => (
                                <ListItem
                                    key={site.id}
                                    button
                                    onClick={() => { setSelectedSite(site); setActiveTab(1); fetchAssets(site.folder); setEditingFile(null); }}
                                    selected={selectedSite?.id === site.id}
                                    sx={{ borderRadius: 2, mb: 0.5, '&.Mui-selected': { bgcolor: 'primary.light', color: 'primary.main', '& .MuiSvgIcon-root': { color: 'primary.main' } } }}
                                >
                                    <Avatar sx={{ width: 32, height: 32, mr: 2, fontSize: '0.8rem', bgcolor: 'transparent', color: 'text.secondary', border: '1px solid #e2e8f0' }}>{site.id[0].toUpperCase()}</Avatar>
                                    <ListItemText primary={site.id} primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }} />
                                    {selectedSite?.id === site.id && <ChevronRight fontSize="small" />}
                                </ListItem>
                            ))}
                        </List>
                    </Box>

                    {/* Main Content Area */}
                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>
                        <AnimatePresence mode="wait">
                            {!selectedSite ? (
                                <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', opacity: 0.5 }}>
                                    <Storage sx={{ fontSize: 80, mb: 2 }} />
                                    <Typography variant="h6">Select a project to manage</Typography>
                                    <Typography variant="body2">Domains, keys, and static assets will appear here.</Typography>
                                </Box>
                            ) : (
                                <Box key={selectedSite.id} component={motion.div} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} sx={{ p: 4, flexGrow: 1, overflowY: 'auto' }}>

                                    {/* Project Overview Header */}
                                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box>
                                            <Breadcrumbs size="small" sx={{ mb: 1 }}>
                                                <Link underline="hover" color="inherit" sx={{ display: 'flex', alignItems: 'center' }}><Storage sx={{ mr: 0.5 }} fontSize="inherit" /> Infrastructure</Link>
                                                <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}> {selectedSite.id}</Typography>
                                            </Breadcrumbs>
                                            <Typography variant="h4">{selectedSite.id}</Typography>
                                            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                                <Chip size="small" icon={<Folder />} label={`Folder: ${selectedSite.folder}`} variant="outlined" sx={{ borderRadius: 1 }} />
                                                <Chip size="small" icon={<Public />} label={`${selectedSite.domains?.length || 0} Domains`} variant="outlined" sx={{ borderRadius: 1 }} />
                                            </Box>
                                        </Box>
                                        <Button variant="outlined" startIcon={<Edit />} onClick={() => { setNewSite(selectedSite); setOpenSiteDialog(true); }}>Configure Site</Button>
                                    </Box>

                                    <Divider sx={{ mb: 4 }} />

                                    {/* Asset Grid Section */}
                                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}><Description sx={{ mr: 1 }} /> Static HTML Assets</Typography>
                                        <Button startIcon={<Add />} variant="contained" color="primary" onClick={() => setOpenFileDialog(true)} disableElevation>New File</Button>
                                    </Box>

                                    <Grid container spacing={2}>
                                        {assets.length === 0 ? (
                                            <Grid item xs={12}>
                                                <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', bgcolor: 'transparent', borderStyle: 'dashed' }}>
                                                    <Typography color="text.secondary">No assets found in this project folder.</Typography>
                                                </Paper>
                                            </Grid>
                                        ) : (
                                            assets.map((asset) => (
                                                <Grid item xs={12} sm={6} md={4} lg={3} key={asset.name}>
                                                    <Card
                                                        sx={{
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s',
                                                            border: editingFile === asset.name ? '2px solid' : '1px solid',
                                                            borderColor: editingFile === asset.name ? 'primary.main' : '#e2e8f0',
                                                            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }
                                                        }}
                                                        onClick={() => handleEditFile(asset.name)}
                                                    >
                                                        <CardContent sx={{ p: 1.5, pb: '12px !important' }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                <Description sx={{ color: 'primary.main', mr: 1, fontSize: 20 }} />
                                                                <Typography variant="body2" fontWeight={700} noWrap sx={{ flexGrow: 1, fontSize: '0.8rem' }}>{asset.name}</Typography>
                                                                <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDeleteFile(asset.name); }}><DeleteOutline fontSize="small" /></IconButton>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>{(asset.size / 1024).toFixed(1)} KB</Typography>
                                                                <Box>
                                                                    <Tooltip title="Preview">
                                                                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); window.open(`/WebSiteStaticImage/html/${selectedSite.folder}/${asset.name}`); }}><Launch fontSize="inherit" /></IconButton>
                                                                    </Tooltip>
                                                                </Box>
                                                            </Box>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            ))
                                        )}
                                    </Grid>

                                    {/* Full Screen Editor Dialog */}
                                    <Dialog
                                        fullScreen
                                        open={!!editingFile}
                                        onClose={() => setEditingFile(null)}
                                        PaperProps={{ sx: { bgcolor: 'background.default' } }}
                                    >
                                        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', bgcolor: 'background.paper' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <IconButton onClick={() => setEditingFile(null)} sx={{ mr: 1 }} color="primary"><ArrowBack /></IconButton>
                                                <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>{editingFile}</Typography>
                                                <Chip label="Live Preview" size="small" color="primary" variant="outlined" sx={{ ml: 2, borderRadius: 1 }} />
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button variant="outlined" onClick={() => setEditingFile(null)}>Cancel</Button>
                                                <Button variant="contained" startIcon={<Save />} onClick={handleSaveFile}>Deployment Save</Button>
                                            </Box>
                                        </Box>
                                        <Box sx={{ flexGrow: 1, display: 'flex', p: 0, overflow: 'hidden' }}>
                                            {/* Code Editor Side */}
                                            <Box sx={{ flex: 1, borderRight: '1px solid #e2e8f0', bgcolor: '#f8fafc', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                                <Box
                                                    component="textarea"
                                                    value={editorContent}
                                                    onChange={(e) => setEditorContent(e.target.value)}
                                                    spellCheck="false"
                                                    sx={{
                                                        width: '100%',
                                                        height: '100%',
                                                        border: 'none',
                                                        outline: 'none',
                                                        p: 2,
                                                        resize: 'none',
                                                        bgcolor: 'transparent',
                                                        fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
                                                        fontSize: '0.85rem', // Consistent readability
                                                        lineHeight: 1.6,
                                                        color: 'text.primary',
                                                        boxSizing: 'border-box', // Ensure padding doesn't overflow width
                                                        '&:focus': { outline: 'none' } // Clean focus state
                                                    }}
                                                />
                                            </Box>
                                            {/* Preview Side */}
                                            <Box sx={{ flex: 1, bgcolor: 'white', display: 'flex', flexDirection: 'column' }}>
                                                <Box sx={{ flexGrow: 1, p: 2, bgcolor: '#f1f5f9' }}>
                                                    <Paper sx={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: 1 }}>
                                                        <iframe
                                                            srcDoc={editorContent}
                                                            title="Preview"
                                                            style={{ width: '100%', height: '100%', border: 'none', background: 'white' }}
                                                        />
                                                    </Paper>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Dialog>
                                </Box>
                            )}
                        </AnimatePresence>
                    </Box>
                </Box>

                {/* Dialogs */}
                <Dialog open={openSiteDialog} onClose={() => setOpenSiteDialog(false)} fullWidth maxWidth="sm">
                    <DialogTitle>{newSite.id ? 'Configure Site Infrastructure' : 'Register New Project'}</DialogTitle>
                    <DialogContent>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>Define the core mappings and folder identifiers for this site entity.</Typography>
                        <Grid container spacing={2}>
                            <Grid item size={{ xs: 12, sm: 6 }}>
                                <TextField fullWidth label="Project ID (Alias)" placeholder="e.g. nxt10" value={newSite.id} onChange={(e) => setNewSite({ ...newSite, id: e.target.value })} disabled={!!newSite.id} />
                            </Grid>
                            <Grid item size={{ xs: 12, sm: 6 }}>
                                <TextField fullWidth label="Physical Folder Name" placeholder="e.g. nxt10_v3" value={newSite.folder} onChange={(e) => setNewSite({ ...newSite, folder: e.target.value })} />
                            </Grid>
                            <Grid item size={{ xs: 12 }}>
                                <TextField fullWidth multiline rows={2} label="Domains (Comma separated)" placeholder="domain1.com, domain2.in" value={newSite.domains?.join(", ") || ""} onChange={(e) => setNewSite({ ...newSite, domains: e.target.value.split(",").map(d => d.trim()).filter(Boolean) })} />
                            </Grid>
                            <Grid item size={{ xs: 12 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}><VpnKey sx={{ mr: 1, fontSize: 18 }} /> Master Keys Configuration</Typography>
                                <TextField fullWidth multiline rows={3} placeholder='{ "KEY1": "value1" }' value={JSON.stringify(newSite.keys || {}, null, 2)} onChange={(e) => { try { setNewSite({ ...newSite, keys: JSON.parse(e.target.value) }); } catch (err) { } }} helperText="Must be valid JSON mapping legacy keys to domains." />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={() => setOpenSiteDialog(false)}>Cancel</Button>
                        <Button variant="contained" size="large" onClick={handleSaveSite}>Provision Infrastructure</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openFileDialog} onClose={() => setOpenFileDialog(false)}>
                    <DialogTitle>Create New Static Asset</DialogTitle>
                    <DialogContent>
                        <TextField autoFocus fullWidth label="Filename" placeholder="index.html" value={newFileName} onChange={(e) => setNewFileName(e.target.value)} sx={{ mt: 1 }} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenFileDialog(false)}>Cancel</Button>
                        <Button variant="contained" onClick={handleCreateFile}>Create File</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </ThemeProvider>
    );
}
