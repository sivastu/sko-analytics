import React, { useState } from 'react';
import { AppBar, Tab, Tabs, Typography } from '@mui/material';

function CategoryTabs({ dataByCategory }) {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  if (!dataByCategory || Object.keys(dataByCategory).length === 0) {
    return <Typography>No data available</Typography>;
  }

  return (
    <div>
      <AppBar position="static">
        <Tabs value={selectedTab} style={{  backgroundColor : '#fff'  }} onChange={handleTabChange}>
          {Object.keys(dataByCategory).map((category, index) => (
            <Tab style={{  backgroundColor : '#fff' }} key={index} label={category} />
          ))}
        </Tabs>
      </AppBar>
      {Object.entries(dataByCategory).map(([category, items], index) => (
        <div key={index} hidden={selectedTab !== index}>
          {selectedTab === index && (
            <div>
              <h2  >{category}</h2>
              <table>
                <thead>
                  <tr>
                    <th>_id</th>
                    <th>id</th>
                    {/* Include other table headers */}
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item._id}>
                      <td>{item._id}</td>
                      <td>{item.id}</td>
                      {/* Include other table cells */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default CategoryTabs;
