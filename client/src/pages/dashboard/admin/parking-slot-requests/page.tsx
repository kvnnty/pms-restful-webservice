// import { useEffect, useState } from "react";

// type Vehicle = {
//   id: string;
//   plateNumber: string;
//   vehicleType: string;
//   vehicleSize: string;
// };

// type Slot = {
//   id: string;
//   slotNumber: string;
//   vehicleSize: string;
//   vehicleType: string;
//   location: string;
//   status: string;
//   parkingId: string;
// };

// type BookingRequest = {
//   id: string;
//   userId: string;
//   vehicleId: string;
//   slotId: string;
//   status: string;
//   createdAt: string;
//   updatedAt: string;
//   vehicle: Vehicle;
//   slot: Slot;
// };

// export default function ViewAllParkingSlotRequestsPage() {
//   const [requests, setRequests] = useState<BookingRequest[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchRequests() {
//       try {
//         const res = await axiosCl("/booking-requests/");
//         if (!res.ok) throw new Error(`HTTP error ${res.status}`);

//         const json = await res.json();

//         if (json.status !== "success") {
//           throw new Error(json.message || "Failed to fetch requests");
//         }

//         setRequests(json.data.data);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchRequests();
//   }, []);

//   if (loading) return <div>Loading booking requests...</div>;
//   if (error) return <div>Error: {error}</div>;

//   if (requests.length === 0) return <div>No booking requests found.</div>;

//   return (
//     <div>
//       <h1>Parking Slot Booking Requests</h1>
//       <table style={{ width: "100%", borderCollapse: "collapse" }}>
//         <thead>
//           <tr>
//             <th>Request ID</th>
//             <th>Status</th>
//             <th>Vehicle</th>
//             <th>Slot</th>
//             <th>Requested At</th>
//           </tr>
//         </thead>
//         <tbody>
//           {requests.map(({ id, status, vehicle, slot, createdAt }) => (
//             <tr key={id} style={{ borderBottom: "1px solid #ddd" }}>
//               <td>{id}</td>
//               <td>{status}</td>
//               <td>
//                 {vehicle.plateNumber} ({vehicle.vehicleType}, {vehicle.vehicleSize})
//               </td>
//               <td>
//                 {slot.slotNumber} - {slot.location} ({slot.vehicleType})
//               </td>
//               <td>{new Date(createdAt).toLocaleString()}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
