import React, { useState, useEffect } from "react";
import "@fontsource/inter";
import axios from "axios";
import HorizontalTabs from './destinationHorizontalTab';
import HOSTNAME_WEB from '../constants/hostname';
import AddThingsToDoForm from './addthingstodoform';
import { SelectChangeEvent } from "@mui/material";
import { Link } from "react-router-dom";

import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";

interface Activity {
  id: number;
  activity_name: string;
  address: string;
  status: string;
  categories: string;
  icon: string;
}

interface Destination {
  id: number;
  activities: string;
  basic_info: string;
}



type Activity_Implementation = {
  id: number | null | string;
  name: string;
  description: string;
  address: string;
  icon: File | string | null;
  gallery: File[] | string[] | null;
  destination_name: string;
  categories: string;
  status: string;
  lon: string;
  lat: string;
  destinationID: string;
};

const ThingstoDoList: React.FC = () => {
  const [activities, setActivities] = useState<Destination[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [destinationFilter, setDestinationFilter] = useState<string>("");
  const [arrayIndex, setArrayIndex]      = useState<number|null>(null);
  const [destinationID, setDestinationID] = useState<number|null>(null);
  const [updateData, setUpdata] =useState<Activity_Implementation>({
      id: null,
      name: '',
      description: '',
      address: '',
      icon: null,
      gallery: null,
      destination_name: '',
      categories: '',
      status: 'Draft',
      lon: '',
      lat: '',
      destinationID: ''
  });

  const queryCategories: string[] = [
    "NATURE & ADVENTURE", "EXPLORATION", "VISIT WORSHIP PLACES", "BEACHES & SUNBATHING", "SPORTS"
  ];
  const queryStatus: string[] = [
    "Published",
    "Draft",
    "Disabled",
    "Pending validation"
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
 
   // Corrigez la fonction pour utiliser le type SelectChangeEvent
  const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
    setStatusFilter(event.target.value); // Pas besoin de type casting ici
  };

 
  const handleCategoryFilterChange = (event: SelectChangeEvent<string>) => {
    setCategoryFilter(event.target.value);
  };

  const handleDestinationFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDestinationFilter(e.target.value);
  };

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedDestinations = React.useMemo(() => {
    if (!sortConfig) return activities;

    return [...activities].sort((a, b) => {
      const key = sortConfig.key as keyof Destination;

      if (a[key] < b[key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [activities, sortConfig]);

  const filteredDestinations = sortedDestinations.filter((activity) => {
    console.log(activity);
    try {
      const basicInfo = JSON.parse(activity.basic_info);
      const destinationName = basicInfo?.destinationName || "";
      const childrenActivities: Activity[] = JSON.parse(activity.activities) || [];
      
      return (
        (!searchQuery || childrenActivities.some((child) =>
          child.activity_name.toLowerCase().includes(searchQuery.toLowerCase())
        )) &&
        (!statusFilter || childrenActivities.some((child) =>
          child.status.toLowerCase() === statusFilter.toLowerCase()
        )) &&
        (!categoryFilter || childrenActivities.some((child) =>
          child.categories.toLowerCase() === categoryFilter.toLowerCase()
        )) &&
        (!destinationFilter || destinationName.toLowerCase().includes(destinationFilter.toLowerCase()))
      );
    } catch (error) {
      console.error("Error parsing activity data:", error);
      return false;
    }


  });
  

  const paginatedDestinations = filteredDestinations.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (destinationId:string|number, arrayIndex:string|number) => {
        setDestinationID(Number(destinationId));
        setArrayIndex(Number(arrayIndex));
  };

  const handleDeleteClick = (id: number, index: number) => {
    setActivities((prev) => prev.filter((dest) => dest.id !== id));

    // Delete from the database
    fetch(`${HOSTNAME_WEB}/activities/delete/${id}/${index}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("An error occurred while deleting the activity.");
        }
        return response.json();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchActivities = async () => {
    try {
      const response = await fetch(`${HOSTNAME_WEB}/destination`);
      if (!response.ok) {
        throw new Error('Error fetching data');
      }

      const data = await response.json();

      // Filter and parse only valid activities
      const activities_db = data
        .map((el: any) => {
          if (el.activities && el.activities.length > 0) {
            return el; // Parse valid activities
          }
          return null; // Ignore invalid or non-existent activities
        })
        .filter((el: any) => el !== null);

      setActivities(activities_db);

    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

//manager the activities

const [permissions, setPermissions] =  useState("");
const [userPrefil, setUserPrefil]   = useState(" ");

const handleUserProfil = (userID: any) => {

  fetch(`${HOSTNAME_WEB}/profil/user_profil/${userID}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error fetching user profile');
      }
      return response.json();
    })
    .then((response) => {
      setUserPrefil(response[0][0].profil_id);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

const allPermissions = () => {
  fetch(`${HOSTNAME_WEB}/profil/`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('There is an error');
      }
      return response.json();
    })
    .then((response) => {
      console.log(permissions);
      // Assuming "data.message" is an array and you want to modify it
      const filteredPermissions = response.message.filter((element:any) =>  {
        
        if(element.id.toString() == userPrefil.toString()){
          return element
        }
      
      }
    
    )
         setPermissions(filteredPermissions[0].permissions);
    
    })
    .catch((error) => {
      console.error('Error:', error);
    });

};

useEffect(()=>{
  allPermissions();
  handleUserProfil(localStorage.getItem('userId'))
}, [permissions, userPrefil]);

 

  return (
    <Box padding={3}>
      {destinationID ? (
        <div>
          <button
            className="btn border font-weight-bold"
            onClick={() => {
              setDestinationID(null);
            }}
          >
            <i className="bi bi-arrow-left"></i> Back
          </button>
          <AddThingsToDoForm 
              index={arrayIndex} 
              destinationID={destinationID}
              updatedData={updateData}
          />
        </div>
      ) : (
        <>
          <Typography variant="h2" sx={{ fontSize: "30px", fontWeight: "bold" }}>
            All Things to Do
          </Typography>
          <Typography variant="subtitle2" mt={2} mb={2}>
            All things to do are listed here. If you need to link an activity to a destination, please switch to edit mode.
          </Typography>

          <Box display="flex" gap={3} marginBottom={3} flexWrap="wrap" justifyContent="space-between">
            <TextField
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              variant="outlined"
              fullWidth
              sx={{
                maxWidth: "400px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                  "& fieldset": {
                    borderColor: "#ccc",
                  },
                  "&:hover fieldset": {
                    borderColor: "#007BFF",
                  },
                },
              }}
            />
            <TextField
              placeholder="Filter by Destination"
              value={destinationFilter}
              onChange={handleDestinationFilterChange}
              variant="outlined"
              fullWidth
              sx={{
                maxWidth: "100px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                  "& fieldset": {
                    borderColor: "#ccc",
                  },
                  "&:hover fieldset": {
                    borderColor: "#007BFF",
                  },
                },
              }}
            />
            <FormControl sx={{ minWidth: 100 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                label="Status"
              >
                <MenuItem value="">All</MenuItem>
                {queryStatus.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 100 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                onChange={handleCategoryFilterChange}
                label="Category"
              >
                <MenuItem value="">All</MenuItem>
                {queryCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TableContainer
            sx={{
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              backgroundColor: "white",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell sx={{ fontWeight: "400" }}>ICON</TableCell>
                  {["Name", "Destination Name", "Address", "Status", "Categories"].map((key) => (
                    <TableCell
                      sx={{ fontWeight: "400" }}
                      key={key}
                      onClick={() => handleSort(key.toLowerCase())}
                    >
                      {key.toUpperCase()}
                    </TableCell>
                  ))}
                  
                  {(permissions.includes("9") || permissions.includes("10") || permissions.includes("11")) && (
                    
                  <TableCell sx={{ fontWeight: "400" }}>ACTIONS</TableCell>
                
                  )}

                {(permissions.includes("8")  && 
                   
                    <TableCell> View</TableCell>

                )}

                </TableRow>
              </TableHead>
              <TableBody>
                  {paginatedDestinations.map((activity) => {
                    const childrenActivities: Activity[] = JSON.parse(activity.activities);
                    const destinationName = JSON.parse(activity.basic_info).destinationName;
                    const destinationID = activity.id;

                    // ✅ Appliquer le filtre sur les activités enfant uniquement
                    const filteredActivities = childrenActivities.filter((child) =>
                      (!searchQuery || child.activity_name.toLowerCase().includes(searchQuery.toLowerCase())) &&
                      (!statusFilter || child.status.toLowerCase() === statusFilter.toLowerCase()) &&
                      (!categoryFilter || child.categories.toLowerCase() === categoryFilter.toLowerCase())
                    );

                    return filteredActivities.map((activityChild) => (
                      <TableRow key={activityChild.id}>
                        <TableCell>{activityChild.id}</TableCell>
                        <TableCell>
                          <img
                            src={`${HOSTNAME_WEB}/public/uploads/destination/activities/${activityChild.icon}`}
                            alt={activityChild.activity_name}
                            style={{
                              height: "50px",
                              width: "50px",
                              borderRadius: "50%",
                            }}
                          />
                        </TableCell>
                        <TableCell>{activityChild.activity_name}</TableCell>
                        <TableCell>{destinationName}</TableCell>
                        <TableCell>{activityChild.address}</TableCell>
                        <TableCell>{activityChild.status}</TableCell>
                        <TableCell>{activityChild.categories}</TableCell>
                          <TableCell>

                          {(permissions.includes("9") || permissions.includes("11")) && (
                          <Button onClick={() => handleEditClick(destinationID, activityChild.id)}>
                            <i className="bi bi-pen"></i>
                          </Button>
                          )}

                          {(permissions.includes("10")  && 
                                <Button color="error" onClick={() => handleDeleteClick(destinationID, activityChild.id)}>
                                  <i className="bi bi-trash"></i>
                                </Button>
                          )}
                        </TableCell>

                      {(permissions.includes("8")  && 
                          <TableCell>
                            <Link to={`/destination/maps/details/${destinationID}/${activityChild.id}`}><i className="bi bi-eye"></i></Link>
                          </TableCell>
                      )}

                      </TableRow>
                    ));
                  })}
                </TableBody>

            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredDestinations.length}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </>
      )}
    </Box>
  );
};

export default ThingstoDoList;
