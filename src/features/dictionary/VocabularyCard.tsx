import { Button, Card, CardActions, CardContent, List, ListItem, ListItemText, Typography } from "@mui/material";
import { ankiRequestAddNote } from "../ankiConnect/ankiConnectAPI";
import { store } from "../../app/store";
import { useState } from "react";

type VocabularyCardProps = {
    word: string;
    meaning: string[];
    example: string[];
}

export default function VocabularyCard(props: VocabularyCardProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleAddNote = () => {
        if (isLoading) {
            return;
        }

        setIsLoading(true);

        ankiRequestAddNote(store.getState().anki, {
            ...props,
            tag: "longman",
        }).then(x => {
            setIsLoading(false);
        })
    }

    return (
        <Card sx={{ minWidth: 345 }} variant="outlined">
            <CardContent>
                <CardActions>
                    <Button size="small" onClick={handleAddNote} disabled={isLoading}>Add to Anki</Button>
                    {/* <Button size="small">Learn More</Button> */}
                </CardActions>
                <Typography gutterBottom variant="h3" component="div">
                    {props.word}
                </Typography>
                <Typography gutterBottom variant="h5" component="div">
                    Meaning:
                </Typography>
                <List>
                    {
                        props.meaning.map(x => {
                            return (<ListItem key={x}><ListItemText primary={x}></ListItemText></ListItem>)
                        })
                    }
                </List>
                <Typography gutterBottom variant="h5" component="div">
                    Examples:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {
                        props.example.map(x => {
                            return (<ListItem key={x}><ListItemText primary={x}></ListItemText></ListItem>)
                        })
                    }
                </Typography>
            </CardContent>
        </Card>
    )
}