import type { TableColumn } from "@/components/common/Table";
import DateTimeCell from "@/components/common/DateTimeCell";
import StatusBadge from "@/shared/components/StatusBadge";
import TeacherAssignmentActions from "../components/TeacherAssignmentActions";
import type { TeacherAssignment } from "../types/teacherAssignment.types";

interface TeacherAssignmentColumnsProps {
    onView?: (assignment: TeacherAssignment) => void;
    onEdit?: (assignment: TeacherAssignment) => void;
    onDelete?: (assignment: TeacherAssignment) => void;
}

export const getTeacherAssignmentColumns = ({
    onView,
    onEdit,
    onDelete,
}: TeacherAssignmentColumnsProps): TableColumn<TeacherAssignment>[] => [
        {
            key: "department",
            label: "Department",
            render: (row) => row.department?.name,
        },
        {
            key: "instructor",
            label: "Instructor",
            render: (row) => row.instructor.name,
        },
        {
            key: "employeeId",
            label: "Instructor ID",
            render: (row) => row.instructor.employeeId,
        },
        {
            key: "class",
            label: "Class",
            render: (row) => row.class.name,
        },
        {
            key: "subject",
            label: "Subject",
            render: (row) => row.subject.name,
        },
        {
            key: "status",
            label: "Status",
            render: (row) => (
                <StatusBadge status={row.status} />
            ),
        },
        {
            key: "createdAt",
            label: "Created Date",
            render: (row) => (
                <DateTimeCell date={row.createdAt} />
            ),
        },
        {
            key: "actions",
            label: "Actions",
            align: "right",
            render: (row) => (
                <TeacherAssignmentActions
                    teacherAssignment={row}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ),
        },
    ];