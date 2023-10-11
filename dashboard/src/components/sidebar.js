import React, { useState } from "react";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { Button, Box, FormControl, InputLabel, Select } from "@mui/material";
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { ShapeLine, Edit } from "@mui/icons-material";
import '../styles/popup.css';

export default function SideBar({collapsed}) {
    const [shape, setShape] = React.useState('');

    const handleChange = (event) => {
      setShape(event.target.value);
    };

    // return (
        

    // )
}