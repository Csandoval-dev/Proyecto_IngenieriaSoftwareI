import { useEffect, useState } from 'react';

const AdminDashboard = () => {
    const [clinics, setClinics] = useState([]);
    const [clinicAdmins, setClinicAdmins] = useState([]);
    const [pendingClinics, setPendingClinics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch all clinics
            const clinicsResponse = await fetch('http://localhost:5002/api/admin/clinics', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (!clinicsResponse.ok) throw new Error('Error fetching clinics');
            const clinicsData = await clinicsResponse.json();
            setClinics(Array.isArray(clinicsData) ? clinicsData : []);

            // Fetch clinic admins
            const adminsResponse = await fetch('http://localhost:5002/api/admin/clinic-admins', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (!adminsResponse.ok) throw new Error('Error fetching clinic admins');
            const adminsData = await adminsResponse.json();
            setClinicAdmins(Array.isArray(adminsData) ? adminsData : []);

            // Fetch pending clinics
            const pendingResponse = await fetch('http://localhost:5002/api/admin/pending-clinics', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (!pendingResponse.ok) throw new Error('Error fetching pending clinics');
            const pendingData = await pendingResponse.json();
            setPendingClinics(Array.isArray(pendingData) ? pendingData : []);
            
            setError(null);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const approveClinic = async (id_clinica) => {
        try {
            const response = await fetch(`http://localhost:5002/api/admin/approve-clinic/${id_clinica}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.ok) {
                // Recargar todos los datos para tener la información actualizada
                await fetchData();
                alert('Clínica aprobada correctamente');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al aprobar clínica');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    };

    if (loading) return <div>Cargando datos...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Dashboard del Administrador General</h1>
            
            <h2>Clínicas Registradas ({clinics.length})</h2>
            {clinics.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Tipo</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clinics.map((clinic) => (
                            <tr key={clinic.id_clinica}>
                                <td>{clinic.nombre}</td>
                                <td>{clinic.tipo}</td>
                                <td>{clinic.estado || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No hay clínicas registradas</p>
            )}

            <h2>Administradores de Clínicas ({clinicAdmins.length})</h2>
            {clinicAdmins.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clinicAdmins.map((admin) => (
                            <tr key={admin.id_usuario}>
                                <td>{admin.nombre}</td>
                                <td>{admin.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No hay administradores de clínicas</p>
            )}

            <h2>Clínicas Pendientes de Aprobación ({pendingClinics.length})</h2>
            {pendingClinics.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Tipo</th>
                            <th>Dirección</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingClinics.map((clinic) => (
                            <tr key={clinic.id_clinica}>
                                <td>{clinic.nombre}</td>
                                <td>{clinic.tipo}</td>
                                <td>{clinic.direccion}</td>
                                <td>
                                    <button onClick={() => approveClinic(clinic.id_clinica)}>Aprobar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No hay clínicas pendientes de aprobación</p>
            )}
        </div>
    );
};

export default AdminDashboard;