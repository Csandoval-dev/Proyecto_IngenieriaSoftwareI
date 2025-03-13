import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from './ClinicAdminDashboard.module.css';

const ClinicAdminDashboard = () => {
  const [clinic, setClinic] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specialties, setSpecialties] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  
  const [doctorForm, setDoctorForm] = useState({
    nombre: '',
    id_especialidad: '',
    horario_disponibles: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Token:", localStorage.getItem('token'));
        console.log("Rol:", localStorage.getItem('userRole'));
        
        // Obtener información de la clínica
        const clinicRes = await axios.get('/api/clinic-admin/my-clinic', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log("Respuesta de clínica:", clinicRes.data);
        setClinic(clinicRes.data);
        
        // Obtener médicos
        const doctorsRes = await axios.get('/api/clinic-admin/doctors', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log("Respuesta de médicos:", doctorsRes.data);
        setDoctors(doctorsRes.data);
        
        // Obtener especialidades
        const specialtiesRes = await axios.get('/api/specialties', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log("Respuesta de especialidades:", specialtiesRes.data);
        setSpecialties(specialtiesRes.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error.response || error);
        toast.error(error.response?.data?.message || 'Error al cargar los datos');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDoctorForm({
      ...doctorForm,
      [name]: value
    });
  };
  
  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setDoctorForm({
      nombre: doctor.nombre,
      id_especialidad: doctor.id_especialidad,
      horario_disponibles: doctor.horario_disponibles
    });
  };
  
  const handleCancelEdit = () => {
    setSelectedDoctor(null);
    setDoctorForm({
      nombre: '',
      id_especialidad: '',
      horario_disponibles: ''
    });
  };
  
  const handleSubmitDoctor = async (e) => {
    e.preventDefault();
    try {
      let response;
      
      if (selectedDoctor) {
        response = await axios.put(`/api/clinic-admin/doctors/${selectedDoctor.id_medico}`, doctorForm, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setDoctors(doctors.map(doc => 
          doc.id_medico === selectedDoctor.id_medico ? response.data.medico : doc
        ));
        
        toast.success('Médico actualizado exitosamente');
      } else {
        response = await axios.post('/api/clinic-admin/doctors', doctorForm, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setDoctors([...doctors, response.data.medico]);
        
        toast.success('Médico agregado exitosamente');
      }
      
      handleCancelEdit();
      
    } catch (error) {
      console.error('Error saving doctor:', error);
      toast.error(error.response?.data?.message || 'Error al guardar médico');
    }
  };
  
  const handleDeleteDoctor = async (id_medico) => {
    if (!window.confirm('¿Está seguro que desea eliminar este médico?')) return;
    
    try {
      await axios.delete(`/api/clinic-admin/doctors/${id_medico}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setDoctors(doctors.filter(doc => doc.id_medico !== id_medico));
      
      toast.success('Médico eliminado exitosamente');
      
      if (selectedDoctor && selectedDoctor.id_medico === id_medico) {
        handleCancelEdit();
      }
    } catch (error) {
      console.error('Error deleting doctor:', error);
      toast.error(error.response?.data?.message || 'Error al eliminar médico');
    }
  };
  
  if (loading) return (
    <div className={styles.loader}>
      <div className={styles.loaderSpinner}></div>
    </div>
  );
  
  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.dashboardTitle}>Dashboard Administrador - {clinic?.nombre}</h1>
      
      <div className="row">
        <div className="col-md-4">
          <div className={styles.clinicInfoCard}>
            <div className={styles.clinicInfoHeader}>
              <h5 className="mb-0">Información de la Clínica</h5>
            </div>
            <div className={styles.clinicInfoBody}>
              <p className={styles.clinicInfoItem}>
                <span className={styles.clinicInfoLabel}>Nombre:</span> {clinic?.nombre}
              </p>
              <p className={styles.clinicInfoItem}>
                <span className={styles.clinicInfoLabel}>Tipo:</span> {clinic?.tipo}
              </p>
              <p className={styles.clinicInfoItem}>
                <span className={styles.clinicInfoLabel}>Dirección:</span> {clinic?.direccion}
              </p>
              <p className={styles.clinicInfoItem}>
                <span className={styles.clinicInfoLabel}>Teléfono:</span> {clinic?.telefono}
              </p>
              <p className={styles.clinicInfoItem}>
                <span className={styles.clinicInfoLabel}>Email:</span> {clinic?.email}
              </p>
            </div>
          </div>
        </div>
        
        <div className="col-md-8">
          <div className={styles.doctorFormCard}>
            <div className={styles.doctorFormHeader}>
              <h5 className="mb-0">
                {selectedDoctor ? 'Editar Médico' : 'Agregar Médico'}
              </h5>
            </div>
            <div className={styles.doctorFormBody}>
              <form onSubmit={handleSubmitDoctor}>
                <div className={styles.formGroup}>
                  <label htmlFor="nombre" className={styles.formLabel}>Nombre del Médico</label>
                  <input
                    type="text"
                    className={styles.formControl}
                    id="nombre"
                    name="nombre"
                    value={doctorForm.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="id_especialidad" className={styles.formLabel}>Especialidad</label>
                  <select
                    className={styles.formControl}
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
                
                <div className={styles.formGroup}>
                  <label htmlFor="horario_disponibles" className={styles.formLabel}>Horario Disponible</label>
                  <input
                    type="text"
                    className={styles.formControl}
                    id="horario_disponibles"
                    name="horario_disponibles"
                    value={doctorForm.horario_disponibles}
                    onChange={handleInputChange}
                    placeholder="Ej: Lunes-Viernes 8:00-16:00"
                    required
                  />
                </div>
                
                <div className={styles.buttonGroup}>
                  <button type="submit" className={styles.submitButton}>
                    {selectedDoctor ? 'Actualizar Médico' : 'Agregar Médico'}
                  </button>
                  {selectedDoctor && (
                    <button 
                      type="button" 
                      className={styles.cancelButton}
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
      
      <div className={styles.doctorsTableCard}>
        <div className={styles.doctorsTableHeader}>
          <h5 className="mb-0">Médicos de la Clínica</h5>
        </div>
        <div className={styles.doctorsTableBody}>
          <div className="table-responsive">
            <table className={styles.doctorsTable}>
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
                      <td className={styles.actionButtons}>
                        <button 
                          className={styles.editButton}
                          onClick={() => handleEditDoctor(doctor)}
                        >
                          Editar
                        </button>
                        <button 
                          className={styles.deleteButton}
                          onClick={() => handleDeleteDoctor(doctor.id_medico)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className={styles.emptyMessage}>No hay médicos registrados</td>
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