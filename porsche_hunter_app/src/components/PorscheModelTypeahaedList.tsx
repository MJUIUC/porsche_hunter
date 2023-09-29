import { useState, useEffect } from 'react';
import { Autocomplete, ListItemText, TextField } from '@mui/material';
import { useAuthentication } from '../hooks/UseAuthentication';

export interface CarData {
  url: string;
  alt: string;
  model: string;
  trim: string;
}

export interface PorscheModelTypeaheadListProps {
  data?: CarData[];
  item?: CarData;
  onSelect: (selectedItem: CarData) => void;
}

export default function PorscheModelTypeaheadList({ data, item, onSelect }: PorscheModelTypeaheadListProps) {
  const [filteredData, setFilteredData] = useState<CarData[] | undefined>(data);
  const [selectedItem, setSelectedItem] = useState<CarData | null>(item || null);
  const { getCookie } = useAuthentication();
  const jwt = getCookie('jwt');

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await fetch('/mini-cdn/porsche_models',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `${jwt}`,
            },
          });
        const data = await response.json();
        setFilteredData(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCarData();
  }, []);

  const handleSelect = (selectedItem: CarData) => {
    setSelectedItem(selectedItem);
    onSelect(selectedItem);
  };

  const autoComplete = () => {
    return (
      <Autocomplete
        options={filteredData as any}
        value={selectedItem}
        getOptionLabel={(option: any) => `${option.model} ${option.trim}`}
        renderOption={
          (props, option: any) => {

            return (
              <li {...props} onClick={() => { handleSelect(option) }}>
                <div className="card">
                  <img src={option.url} alt={option.alt} style={{ width: '100px', height: '50px' }} />
                  <ListItemText
                    primary={option.model}
                    secondary={option.trim}
                  />
                </div>
              </li>
            );
          }
        }
        renderInput={(params) => <TextField {...params} label="Search..." variant="outlined" />}
      />
    );
  }

  return (
    <>
      {filteredData ? autoComplete() : <></>}
    </>
  );
};
