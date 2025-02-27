import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DestinationBasicInfo from './destinationBasicInfo'
import Media from "./destinationGalery";
import Culture from '../screens/culture';
import PratiqueInfo from "../screens/pratique_info";
import SmallHeader from "./smallHeader";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`horizontal-tabpanel-${index}`}
      aria-labelledby={`horizontal-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `horizontal-tab-${index}`,
    "aria-controls": `horizontal-tabpanel-${index}`,
  };
}

type basicPros = number | null;


export default function HorizontalTabs({ index = null }: { index?: basicPros }){

  const [value, setValue] = React.useState(0);
  const [previewLink, setPreviewLink] = React.useState(' ');

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
   
  React.useEffect(()=> setPreviewLink(``), []);


  return (
    <Box display="flex">
      <Box flex={5}>
        <Box>
          <SmallHeader title="Add destinations" link={previewLink}/>
        </Box>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="Horizontal tabs example"
            TabIndicatorProps={{
              style: {
                backgroundColor: "#1976d2",
                height: "3px",
              },
            }}
            textColor="inherit"
            sx={{
              "& .MuiTab-root": {
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "16px",
                color: "#444",
              }
            }}
        >
          <Tab label="Basic Info " {...a11yProps(0)} />
          <Tab label="Gallery" {...a11yProps(1)} />
          <Tab label="Pratique Info" {...a11yProps(1)} />
        </Tabs>
      </Box>
      {/* Contenu des panneaux */}
        <TabPanel value={value} index={0}>
          <Typography variant="body1">
          <DestinationBasicInfo index={index}/>
          </Typography>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Media index={index}/>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <PratiqueInfo  index={20}/>
        </TabPanel>
      </Box>
    </Box>
  );
}
