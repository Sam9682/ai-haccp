import React from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations/translations';

export default function LanguageSwitcher() {
  const { language, switchLanguage } = useLanguage();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (lang) => {
    switchLanguage(lang);
    handleClose();
  };

  return (
    <>
      <Button
        startIcon={<LanguageIcon />}
        onClick={handleClick}
        color="inherit"
        sx={{ textTransform: 'none' }}
      >
        {language === 'en' ? 'EN' : 'FR'}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleLanguageChange('en')}>
          English
        </MenuItem>
        <MenuItem onClick={() => handleLanguageChange('fr')}>
          Français
        </MenuItem>
      </Menu>
    </>
  );
}