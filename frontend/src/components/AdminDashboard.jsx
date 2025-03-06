import { useEffect, useState } from 'react';

const AdminDashboard = () => {
    const [clinics, setClinics] = useState([]);
    const [clinicAdmins, setClinicAdmins] = useState([]);
    const [pendingClinics, setPendingClinics] = useState([]);

    useEffect(() => {
        const fetchClinics = async () => {
            const response = await fetch('http://localhost:5002/api/admin/clinics', {
                headers: { Authorization: localStorage.getItem('token') }
            });
            const data = await response.json();
            console.log('Clinics:', data); // Verificar la respuesta
            setClinics(data);
        };

        const fetchClinicAdmins = async () => {
            const response = await fetch('http://localhost:5002/api/admin/clinic-admins', {
                headers: { Authorization: localStorage.getItem('token') }
            });
            const data = await response.json();
            console.log('Clinic Admins:', data); // Verificar la respuesta
            setClinicAdmins(data);
        };

        const fetchPendingClinics = async () => {
            const response = await fetch('http://localhost:5002/api/admin/pending-clinics', {
                headers: { Authorization: localStorage.getItem('token') }
            });
            const data = await response.json();
            console.log('Pending Clinics:', data); // Verificar la respuesta
            setPendingClinics(data);
        };

        fetchClinics();
        fetchClinicAdmins();
        fetchPendingClinics();
    }, []);

    const approveClinic = async (id_clinica) => {
        try {
            const response = await fetch(`http://localhost:5002/api/admin/approve-clinic/${id_clinica}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('token')
                }
            });
            
            if (response.ok) {
                setPendingClinics(pendingClinics.filter(clinic => clinic.id_clinica !== id_clinica));
            } else {
                console.error('Error al aprobar clínica');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>Dashboard del Administrador General</h1>
            
            <h2>Clínicas Registradas</h2>
            <ul>
                {clinics.map((clinic) => (
                    <li key={clinic.id_clinica}>{clinic.nombre}</li>
                ))}
            </ul>

            <h2>Administradores de Clínicas</h2>
            <ul>
                {clinicAdmins.map((admin) => (
                    <li key={admin.id}>{admin.nombre} - {admin.email}</li>
                ))}
            </ul>

            <h2>Clínicas Pendientes de Aprobación</h2>
            <ul>
                {pendingClinics.map((clinic) => (
                    <li key={clinic.id_clinica}>
                        {clinic.nombre} ({clinic.estado})
                        <button onClick={() => approveClinic(clinic.id_clinica)}>Aprobar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminDashboard;