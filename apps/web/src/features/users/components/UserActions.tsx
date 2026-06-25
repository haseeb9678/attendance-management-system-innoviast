import { Eye, Pencil, Trash2 } from "lucide-react";

const UserActions = ({ user }) => {
    return (
        <div className="flex justify-end gap-2">
            <button>
                <Eye size={18} />
            </button>

            <button>
                <Pencil size={18} />
            </button>

            <button>
                <Trash2 size={18} />
            </button>
        </div>
    );
};

export default UserActions;