import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ClinicAdminDashboard = () => {
    const [clinic, setClinic] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('doctors');
    const [showAddDoctorForm, setShowAddDoctorForm] = useState(false);
    const [newDoctor, setNewDoctor] = useState({
        nombre: '',
        id_especialidad: '',
        horario_disponibles: ''
    });
    
    const navigate = useNavigate();

    const fetchClinicData = async () => {
        setLoading(true);
        try {
            // Obtener información de la clínica asociada al administrador
            const clinicResponse = await fetch('http://localhost:5002/api/clinic-admin/my-clinic', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            
            if (!clinicResponse.ok) throw new Error('Error obteniendo información de la clínica');
            const clinicData = await clinicResponse.json();
            setClinic(clinicData);
            
            // Obtener los médicos de la clínica
            const doctorsResponse = await fetch(`http://localhost:5002/api/clinic-admin/doctors`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            
            if (!doctorsResponse.ok) throw new Error('Error obteniendo médicos');
            const doctorsData = await doctorsResponse.json();
            setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
            
            // Obtener especialidades disponibles
            const specialtiesResponse = await fetch('http://localhost:5002/api/specialties', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            
            if (!specialtiesResponse.ok) throw new Error('Error obteniendo especialidades');
            const specialtiesData = await specialtiesResponse.json();
            setSpecialties(Array.isArray(specialtiesData) ? specialtiesData : []);
            
            setError(null);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClinicData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDoctor({
            ...newDoctor,
            [name]: value
        });
    };

    const handleAddDoctor = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5002/api/clinic-admin/doctors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newDoctor)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al agregar médico');
            }
            
            // Actualizar la lista de médicos
            await fetchClinicData();
            
            // Resetear el formulario
            setNewDoctor({
                nombre: '',
                id_especialidad: '',
                horario_disponibles: ''
            });
            
            setShowAddDoctorForm(false);
            alert('Médico agregado correctamente');
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    };

    if (loading) return <div className="loading">Cargando datos...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    if (!clinic) return <div className="error">No se encontró información de la clínica</div>;

    return (
        <div className="clinic-admin-dashboard">
            <h1>Panel de Administración - {clinic.nombre}</h1>
            <div className="clinic-info">
                <p><strong>Tipo:</strong> {clinic.tipo}</p>
                <p><strong>Dirección:</strong> {clinic.direccion}</p>
                <p><strong>Teléfono:</strong> {clinic.telefono}</p>
            </div>
            
            <div className="tabs">
                <button 
                    className={activeTab === 'doctors' ? 'active' : ''} 
                    onClick={() => setActiveTab('doctors')}
                >
                    Médicos
                </button>
                <button 
                    className={activeTab === 'appointments' ? 'active' : ''} 
                    onClick={() => setActiveTab('appointments')}
                >
                    Citas
                </button>
            </div>
            
            {/* Contenido de la pestaña de médicos */}
            {activeTab === 'doctors' && (
                <div className="tab-content">
                    <div className="header-actions">
                        <h2>Médicos de la Clínica ({doctors.length})</h2>
                        <button 
                            className="add-btn"
                            onClick={() => setShowAddDoctorForm(!showAddDoctorForm)}
                        >
                            {showAddDoctorForm ? 'Cancelar' : 'Agregar Médico'}
                        </button>
                    </div>
                    
                    {showAddDoctorForm && (
                        <form className="add-doctor-form" onSubmit={handleAddDoctor}>
                            <div className="form-group">
                                <label>Nombre del Médico:</label>
                                <input 
                                    type="text" 
                                    name="nombre" 
                                    value={newDoctor.nombre} 
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Especialidad:</label>
                                <select 
                                    name="id_especialidad" 
                                    value={newDoctor.id_especialidad}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Selecciona una especialidad</option>
                                    {specialties.map(specialty => (
                                        <option key={specialty.id_especialidad} value={specialty.id_especialidad}>
                                            {specialty.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Horario Disponible:</label>
                                <input 
                                    type="text" 
                                    name="horario_disponibles" 
                                    value={newDoctor.horario_disponibles} 
                                    onChange={handleInputChange}
                                    placeholder="Ej: Lunes-Viernes 8AM-12PM, 2PM-6PM"
                                    required
                                />
                            </div>
                            <button type="submit" className="submit-btn">Guardar Médico</button>
                        </form>
                    )}
                    
                    {doctors.length > 0 ? (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Especialidad</th>
                                    <th>Horario</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {doctors.map((doctor) => (
                                    <tr key={doctor.id_medico}>
                                        <td>{doctor.id_medico}</td>
                                        <td>{doctor.nombre}</td>
                                        <td>{doctor.especialidad}</td>
                                        <td>{doctor.horario_disponibles}</td>
                                        <td className="actions">
                                            <button 
                                                className="edit-btn"
                                                onClick={() => navigate(`/doctor/${doctor.id_medico}/edit`)}
                                            >
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No hay médicos registrados en esta clínica</p>
                    )}
                </div>
            )}
            
            {/* Contenido de la pestaña de citas */}
            {activeTab === 'appointments' && (
                <div className="tab-content">
                    <h2>Citas Médicas</h2>
                    <p>Aquí se mostrará un listado de las citas programadas en la clínica.</p>
                    {/* Implementar cuando se desarrolle la funcionalidad de citas */}
                </div>
            )}
        </div>
    );
};

export default ClinicAdminDashboard;