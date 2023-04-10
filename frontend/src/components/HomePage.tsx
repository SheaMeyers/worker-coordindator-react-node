import WorkerHome from './base/WorkerHome';
import AdminHome from './base/AdminHome';
import NotAuthedHome from './base/NotAuthedHome';
import '../styles/HomePage.css';


const HomePage = () => {
  const isAdmin = localStorage.getItem('isAdmin')
  const token = localStorage.getItem('token')

  return (
    token ?
      isAdmin === 'true' ?
        <AdminHome />
      :
        <WorkerHome />
    :
    <NotAuthedHome />
  );
}

export default HomePage;
