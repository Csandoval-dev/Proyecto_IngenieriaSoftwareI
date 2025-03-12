// ClinicAdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ClinicAdminDashboard = () => {
  const [clinic, setClinic] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specialties, setSpecialties] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  
  // Estado para el formulario de nuevo/editar médico
  const [doctorForm, setDoctorForm] = useState({
    nombre: '',
    id_especialidad: '',
    horario_disponibles: ''
  });

  // Obtener datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Obtener información de la clínica
        const clinicRes = await axios.get('/api/clinic-admin/my-clinic');
        setClinic(clinicRes.data);
        
        // Obtener médicos
        const doctorsRes = await axios.get('/api/clinic-admin/doctors');
        setDoctors(doctorsRes.data);
        
        // Obtener especialidades
        const specialtiesRes = await axios.get('/api/specialties');
        setSpecialties(specialtiesRes.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Error al cargar los datos');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDoctorForm({
      ...doctorForm,
      [name]: value
    });
  };
  
  // Preparar formulario para editar médico
  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setDoctorForm({
      nombre: doctor.nombre,
      id_especialidad: doctor.id_especialidad,
      horario_disponibles: doctor.horario_disponibles
    });
  };
  
  // Cancelar edición
  const handleCancelEdit = () => {
    setSelectedDoctor(null);
    setDoctorForm({
      nombre: '',
      id_especialidad: '',
      horario_disponibles: ''
    });
  };
  
  // Guardar médico (nuevo o editado)
  const handleSubmitDoctor = async (e) => {
    e.preventDefault();
    try {
      let response;
      
      if (selectedDoctor) {
        // Actualizar médico existente
        response = await axios.put(`/api/clinic-admin/doctors/${selectedDoctor.id_medico}`, doctorForm);
        
        // Actualizar lista de médicos
        setDoctors(doctors.map(doc => 
          doc.id_medico === selectedDoctor.id_medico ? response.data.medico : doc
        ));
        
        toast.success('Médico actualizado exitosamente');
      } else {
        // Agregar nuevo médico
        response = await axios.post('/api/clinic-admin/doctors', doctorForm);
        
        // Añadir a la lista de médicos
        setDoctors([...doctors, response.data.medico]);
        
        toast.success('Médico agregado exitosamente');
      }
      
      // Limpiar formulario y estado de edición
      handleCancelEdit();
      
    } catch (error) {
      console.error('Error saving doctor:', error);
      toast.error(error.response?.data?.message || 'Error al guardar médico');
    }
  };
  
  // Eliminar médico
  const handleDeleteDoctor = async (id_medico) => {
    if (!window.confirm('¿Está seguro que desea eliminar este médico?')) return;
    
    try {
      await axios.delete(`/api/clinic-admin/doctors/${id_medico}`);
      
      // Actualizar lista de médicos
      setDoctors(doctors.filter(doc => doc.id_medico !== id_medico));
      
      toast.success('Médico eliminado exitosamente');
      
      // Si estamos editando el médico eliminado, limpiar formulario
      if (selectedDoctor && selectedDoctor.id_medico === id_medico) {
        handleCancelEdit();
      }
    } catch (error) {
      console.error('Error deleting doctor:', error);
      toast.error(error.response?.data?.message || 'Error al eliminar médico');
    }
  };
  
  if (loading) return <div className="text-center mt-5">Cargando datos...</div>;
  
  return (
    <div className="container mt-4">
      <h1 className="mb-4">Dashboard Administrador - {clinic?.nombre}</h1>
      
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="card-title mb-0">Información de la Clínica</h5>
            </div>
            <div className="card-body">
              <p><strong>Nombre:</strong> {clinic?.nombre}</p>
              <p><strong>Tipo:</strong> {clinic?.tipo}</p>
              <p><strong>Dirección:</strong> {clinic?.direccion}</p>
              <p><strong>Teléfono:</strong> {clinic?.telefono}</p>
              <p><strong>Email:</strong> {clinic?.email}</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="card-title mb-0">
                {selectedDoctor ? 'Editar Médico' : 'Agregar Médico'}
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmitDoctor}>
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre del Médico</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombre"
                    name="nombre"
                    value={doctorForm.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="id_especialidad" className="form-label">Especialidad</label>
                  <select
                    className="form-control"
                    id="id_especialidad"
                    name="id_especialidad"
                    value={doctorForm.id_especialidad}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar especialidad</option>
                    {specialties.map(specialty => (
                      <option key={specialty.id_especialidad} value={specialty.id_especialidad}>
                        {specialty.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="horario_disponibles" className="form-label">Horario Disponible</label>
                  <input
                    type="text"
                    className="form-control"
                    id="horario_disponibles"
                    name="horario_disponibles"
                    value={doctorForm.horario_disponibles}
                    onChange={handleInputChange}
                    placeholder="Ej: Lunes-Viernes 8:00-16:00"
                    required
                  />
                </div>
                
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-success">
                    {selectedDoctor ? 'Actualizar Médico' : 'Agregar Médico'}
                  </button>
                  {selectedDoctor && (
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={handleCancelEdit}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-header bg-info">
          <h5 className="card-title mb-0">Médicos de la Clínica</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
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
                {doctors.length > 0 ? (
                  doctors.map(doctor => (
                    <tr key={doctor.id_medico}>
                      <td>{doctor.id_medico}</td>
                      <td>{doctor.nombre}</td>
                      <td>{doctor.especialidad}</td>
                      <td>{doctor.horario_disponibles}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => handleEditDoctor(doctor)}
                        >
                          Editar
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteDoctor(doctor.id_medico)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">No hay médicos registrados</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicAdminDashboard;