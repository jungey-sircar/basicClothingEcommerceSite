import { FaEdit } from "react-icons/fa";

export default function UserCard({ user, serial, showModal }) {
    return (
        <tr>
            <th>{serial + 1}</th>
            <td className="flex gap-2 items-center text-xl">
                <div className="avatar">
                    <div className="w-10 rounded-box">
                        <img src={user.photoURL} alt={user.name} />
                    </div>
                </div>
                {user.name}
            </td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td className={`${user.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>{user.status}</td>
            <td>
                <button className="btn btn-square btn-ghost" onClick={() => showModal(user)}>
                    <FaEdit />
                </button>
            </td>
        </tr>
    );
}