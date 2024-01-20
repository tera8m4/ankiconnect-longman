import { Button, Dialog, DialogContent } from "@mui/material";
import { useState } from "react";
import AnkiSettings from "./AnkiSettings";

export default function AnkiSettingsDialog() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div>
            <Button onClick={() => setIsOpen(true)} variant="contained">Open settings</Button>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} scroll="paper">
                <DialogContent>
                    <AnkiSettings />
                </DialogContent>
            </Dialog>
        </div>
    )
}