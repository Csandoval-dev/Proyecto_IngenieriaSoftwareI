import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
    const [clinics, setClinics] = useState([]);
    const [clinicAdmins, setClinicAdmins] = useState([]);
    const [pendingClinics, setPendingClinics] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('clinics');
    const [rejectReason, setRejectReason] = useState('');
    const [clinicToReject, setClinicToReject] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    
    const navigate = useNavigate();

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
            
            // Fetch all users with roles
            const usersResponse = await fetch('http://localhost:5002/api/admin/users', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (!usersResponse.ok) throw new Error('Error fetching users');
            const usersData = await usersResponse.json();
            setUsers(Array.isArray(usersData) ? usersData : []);
            
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
    
    const showRejectForm = (clinic) => {
        setClinicToReject(clinic);
        setRejectReason('');
        setShowRejectModal(true);
    };
    
    const cancelReject = () => {
        setClinicToReject(null);
        setRejectReason('');
        setShowRejectModal(false);
    };
    
    const confirmReject = async () => {
        if (!clinicToReject) return;
        
        try {
            const response = await fetch(`http://localhost:5002/api/admin/reject-clinic/${clinicToReject.id_clinica}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ reason: rejectReason })
            });
            
            if (response.ok) {
                // Recargar todos los datos para tener la información actualizada
                await fetchData();
                alert('Clínica rechazada correctamente');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al rechazar clínica');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        } finally {
            setShowRejectModal(false);
            setClinicToReject(null);
            setRejectReason('');
        }
    };

    if (loading) return <div className={styles['loading']}>Cargando datos...</div>;
    if (error) return <div className={styles['error']}>Error: {error}</div>;

    return (
        <div className={styles['admin-dashboard']}>
            <h1>Dashboard del Administrador General</h1>
            
            <div className={styles['tabs']}>
                <button 
                    className={activeTab === 'clinics' ? styles['active'] : ''} 
                    onClick={() => setActiveTab('clinics')}
                >
                    Clínicas
                </button>
                <button 
                    className={activeTab === 'pending' ? styles['active'] : ''} 
                    onClick={() => setActiveTab('pending')}
                >
                    Pendientes ({pendingClinics.length})
                </button>
                <button 
                    className={activeTab === 'admins' ? styles['active'] : ''} 
                    onClick={() => setActiveTab('admins')}
                >
                    Administradores
                </button>
                <button 
                    className={activeTab === 'users' ? styles['active'] : ''} 
                    onClick={() => setActiveTab('users')}
                >
                    Usuarios
                </button>
            </div>
            
            {/* Contenido de la pestaña de clínicas registradas */}
            {activeTab === 'clinics' && (
                <div className={styles['tab-content']}>
                    <h2>Clínicas Registradas ({clinics.filter(c => c.estado === 'activa').length})</h2>
                    {clinics.filter(c => c.estado === 'activa').length > 0 ? (
                        <table className={styles['data-table']}>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Tipo</th>
                                    <th>Dirección</th>
                                    <th>Teléfono</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clinics.filter(c => c.estado === 'activa').map((clinic) => (
                                    <tr key={clinic.id_clinica}>
                                        <td>{clinic.nombre}</td>
                                        <td>{clinic.tipo}</td>
                                        <td>{clinic.direccion}</td>
                                        <td>{clinic.telefono}</td>
                                        <td>{clinic.email || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No hay clínicas registradas con estado activo</p>
                    )}
                </div>
            )}
            
            {/* Contenido de la pestaña de clínicas pendientes */}
            {activeTab === 'pending' && (
                <div className={styles['tab-content']}>
                    <h2>Clínicas Pendientes de Aprobación ({pendingClinics.length})</h2>
                    {pendingClinics.length > 0 ? (
                        <table className={styles['data-table']}>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Tipo</th>
                                    <th>Dirección</th>
                                    <th>Teléfono</th>
                                    <th>Email</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingClinics.map((clinic) => (
                                    <tr key={clinic.id_clinica}>
                                        <td>{clinic.nombre}</td>
                                        <td>{clinic.tipo}</td>
                                        <td>{clinic.direccion}</td>
                                        <td>{clinic.telefono}</td>
                                        <td>{clinic.email || 'N/A'}</td>
                                        <td className={styles['actions']}>
                                            <button 
                                                className={styles['approve-btn']}
                                                onClick={() => approveClinic(clinic.id_clinica)}
                                            >
                                                Aprobar
                                            </button>
                                            <button 
                                                className={styles['reject-btn']}
                                                onClick={() => showRejectForm(clinic)}
                                            >
                                                Rechazar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No hay clínicas pendientes de aprobación</p>
                    )}
                </div>
            )}
            
            {/* Contenido de la pestaña de administradores */}
            {activeTab === 'admins' && (
                <div className={styles['tab-content']}>
                    <h2>Administradores de Clínicas ({clinicAdmins.length})</h2>
                    {clinicAdmins.length > 0 ? (
                        <table className={styles['data-table']}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Clínica</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clinicAdmins.map((admin) => (
                                    <tr key={admin.id_usuario}>
                                        <td>{admin.id_usuario}</td>
                                        <td>{admin.nombre}</td>
                                         <td>{admin.email}</td>
                                         <td>{admin.nombre_clinica}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No hay administradores de clínicas</p>
                    )}
                </div>
            )}
            
            {/* Contenido de la pestaña de usuarios */}
            {activeTab === 'users' && (
                <div className={styles['tab-content']}>
                    <h2>Todos los Usuarios ({users.length})</h2>
                    {users.length > 0 ? (
                        <table className={styles['data-table']}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Rol</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.sort((a, b) => a.id_usuario - b.id_usuario).map((user) => (
                                    <tr key={user.id_usuario}>
                                        <td>{user.id_usuario}</td>
                                        <td>{user.nombre}</td>
                                        <td>{user.email}</td>
                                        <td>{user.rol}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No hay usuarios registrados</p>
                    )}
                </div>
            )}
            
            {/* Modal para rechazar clínica */}
            {showRejectModal && (
                <div className={styles['modal-overlay']}>
                    <div className={styles['modal']}>
                        <h2>Rechazar Clínica</h2>
                        <p>Está a punto de rechazar la solicitud de la clínica <strong>{clinicToReject?.nombre}</strong>.</p>
                        <div className={styles['form-group']}>
                            <label htmlFor="rejectReason">Razón del rechazo:</label>
                            <textarea 
                                id="rejectReason"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Indique la razón por la que se rechaza esta solicitud"
                                rows="4"
                            ></textarea>
                        </div>
                        <div className={styles['modal-actions']}>
                            <button className={styles['cancel-btn']} onClick={cancelReject}>Cancelar</button>
                            <button className={styles['confirm-btn']} onClick={confirmReject}>Confirmar Rechazo</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;