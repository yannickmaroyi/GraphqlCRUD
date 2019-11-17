import React from 'react';
import { GET_USERS, VIEW_USERS} from './queries';
import { useQuery} from '@apollo/react-hooks';
import { Card,CardBody, CardSubtitle, CardHeader } from 'reactstrap';
import './App.css';

function App() {

  const getAllUsers = useQuery(GET_USERS);
  const userInfo = useQuery(VIEW_USERS, { variables: { id: 3 }})
  console.log(getAllUsers);
  return (
    <div className="App">
       <Card>
         <CardHeader>
           displaying all data
         </CardHeader>
         <CardBody>
           <CardSubtitle> nice</CardSubtitle>
           <pre>
             { JSON.stringify(getAllUsers.data, null, 2)}
           </pre>
         </CardBody>
       </Card>
    </div>
  );
}

export default App;
