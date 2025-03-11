// import { createContext, useContext, useState } from "react";

// export const FriendRequestsContext = createContext({
//   requests: [],
//   acceptFriendRequest: () => {},
//   rejectFriendRequest: () => {},
// });

// function FriendsProvider({ children }) {
//   const [requests, setRequests] = useState([]);

//   const acceptFriendRequest = (userId) => {
//     setRequests((prevRequests) =>
//       prevRequests.map((request) =>
//         request.id === userId ? { ...request, status: "accepted" } : request
//       )
//     );
//   };

//   const rejectFriendRequest = (userId) => {
//     setRequests((prevRequests) =>
//       prevRequests.map((request) =>
//         request.id === userId ? { ...request, status: "rejected" } : request
//       )
//     );
//   };

//   const value = {
//     requests,
//     acceptFriendRequest,
//     rejectFriendRequest,
//   };

//   return (
//     <FriendRequestsContext.Provider value={value}>
//       {children}
//     </FriendRequestsContext.Provider>
//   );
// }

// export function useFriendRequests() {
//   return useContext(FriendRequestsContext);
// }

// export default FriendsProvider;
