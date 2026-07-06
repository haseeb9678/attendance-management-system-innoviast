import Combobox from "@/components/common/Combobox";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import EntriesSelect from "@/components/common/EnteriesSelect";
import ExportButton from "@/components/common/ExportButton";
import FormButton from "@/components/common/FormButton";
import Pagination from "@/components/common/Pagination";
import SearchBox from "@/components/common/SearchBox";
import SelectBox from "@/components/common/SelectBox";
import DataTable from "@/components/common/Table";
import { useClassOptions } from "@/features/class/hooks/useClassOptions";
import { useDepartmentOptions } from "@/features/department/hooks/useDepartmentOptions";
import { useSubjectOptions } from "@/features/subject/hooks/useSubjectOptions";
import { getTeacherAssignmentColumns } from "@/features/teacherAssignment/constants/teacherAssignmentColumns";
import { teacherAssignmentExportColumns } from "@/features/teacherAssignment/constants/teacherAssignmentExportColumns";
import { useTeacherAssignments } from "@/features/teacherAssignment/hooks/useTeacherAssignment";
import { useDeleteTeacherAssignment } from "@/features/teacherAssignment/hooks/useTeacherAssignmentMutations";
import type { TeacherAssignment } from "@/features/teacherAssignment/types/teacherAssignment.types";
import { limitOptions, sortOptions, statusOptions } from "@/shared/constants/filters";
import useDebounce from "@/shared/hooks/useDebounce";
import { LucidePlus, LucideUpload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SEO } from '@/shared/components/SEO';

const TeacherAssignments = () => {
    const [status, setStatus] = useState(statusOptions[0]);
    const [sort, setSort] = useState(sortOptions[0]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(limitOptions[0]);
    const [selectedclass, setSelectedClass] = useState<{ label: string; value: string } | undefined | null>(undefined)
    const [selectedSubject, setSelectedSubject] = useState<{ label: string; value: string } | undefined | null>(undefined)
    const [selectedDepartment, setSelectedDepartment] = useState<{ label: string; value: string } | undefined | null>(undefined)
    const [selectedTeacherAssignment, setSelectedTeacherAssignment] = useState<TeacherAssignment | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);


    const debouncedSearch = useDebounce(search, 500);

    const navigate = useNavigate();

    const { data, isPending: isLoading } = useTeacherAssignments({
        search: debouncedSearch,
        status: status.value as "active" | "inactive",
        sort: sort.value as "oldest" | "newest",
        class: selectedclass?.value as string | undefined,
        subject: selectedSubject?.value as string | undefined,
        department: selectedDepartment?.value as string | undefined,
        page,
        limit: limit.value,
    });

    const { options: departmentOptions, isLoading: isDepartmentLoading } = useDepartmentOptions()

    const allDepartmentOptions = useMemo(
        () => [
            {
                label: "All Departments",
                value: "",
            },
            ...(departmentOptions ?? []),
        ],
        [departmentOptions]
    );



    const { options: classOptions, isLoading: isClassLoading } = useClassOptions({
        department: selectedDepartment?.value as string | undefined
    })
    const allClassOptions = useMemo(
        () => [
            {
                label: "All Classes",
                value: "",
            },
            ...(classOptions ?? []),
        ],
        [classOptions]
    );

    const { options: subjectOptions, isLoading: isSubjectLoading } = useSubjectOptions({
        department: selectedDepartment?.value as string | undefined
    })
    const allSubjectOptions = useMemo(
        () => [
            {
                label: "All Subjects",
                value: "",
            },
            ...(subjectOptions ?? []),
        ],
        [subjectOptions]
    );

    const { mutate, isPending: isDeleting } = useDeleteTeacherAssignment()


    const handleView = (assignment: TeacherAssignment) => {
        navigate(`${assignment._id}/info`);
    };

    const handleEdit = (assignment: TeacherAssignment) => {
        navigate(`${assignment._id}/update`);
    };

    const handleDeleteClick = (assignment: TeacherAssignment) => {
        setSelectedTeacherAssignment(assignment);
        setDeleteOpen(true);
    };

    const handleDelete = () => {
        if (!selectedTeacherAssignment) return;


        mutate(selectedTeacherAssignment._id, {
            onSuccess: (res) => {
                toast.success(res.message);
            },

            onError: (err) => {
                toast.error(err.message);
            },
        })

        setDeleteOpen(false);
        setSelectedTeacherAssignment(null);
    };

    const columns = useMemo(
        () =>
            getTeacherAssignmentColumns({
                onView: handleView,
                onEdit: handleEdit,
                onDelete: handleDeleteClick,
            }),
        []
    );

    const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);



    useEffect(() => {
        if (selectedDepartment) {
            setSelectedClass(allClassOptions[0])
            setSelectedSubject(allSubjectOptions[0])
            return
        };

        setSelectedDepartment(allDepartmentOptions[0]);
    }, [allDepartmentOptions, selectedDepartment]);


    useEffect(() => {
        if (selectedclass) {
            setSelectedSubject(allSubjectOptions[0])
            return
        };

        setSelectedClass(allClassOptions[0]);
    }, [allClassOptions, selectedclass, allSubjectOptions]);

    useEffect(() => {
        if (selectedSubject) return;

        setSelectedSubject(allSubjectOptions[0]);
    }, [allSubjectOptions, selectedSubject]);



    return (
        <>
            <SEO title="Teacher Assignments | Attendix" description="Manage teacher assignments in Attendix with attendance and academic workflows." noindex />
            <section
                className="bg-bg-card border border-border rounded-md
            flex flex-col gap-3 shadow-sm flex-1
            h-max
            min-w-0"
            >
                <div className="p-6 flex flex-col md:flex-row justify-between gap-5">
                    <h2 className="text-text-base text-2xl font-bold">
                        Assignments
                    </h2>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <FormButton
                            type="button"
                            text="Assign Teacher"
                            className="min-w-max h-10! px-5 text-sm
                        bg-success hover:bg-success-hover"
                            Icon={LucidePlus}
                            onClick={() => navigate("add")}
                        />
                        <ExportButton
                            data={data?.data ?? []}
                            selectedRowIds={selectedRowIds}
                            getRowId={(row) => row._id}
                            fileName="teacher_assingments"
                            columns={teacherAssignmentExportColumns}
                        />
                    </div>
                </div>

                <div className="border-t border-dashed border-border" />

                <div
                    className="grid grid-cols-1 md:grid-cols-2
                lg:grid-cols-7 gap-3 p-6 py-4
                border-b border-dashed border-border"
                >
                    <div className="lg:col-span-2">
                        <SearchBox
                            value={search}
                            onChange={setSearch}
                            placeholder="Search subjects by name or code..."
                        />
                    </div>

                    <SelectBox
                        label="Status"
                        option={status}
                        setOption={setStatus}
                        options={statusOptions}
                    />

                    <SelectBox
                        label="Sort"
                        option={sort}
                        setOption={setSort}
                        options={sortOptions}
                    />
                    <Combobox
                        label="Department"
                        option={selectedDepartment}
                        setOption={setSelectedDepartment}
                        options={allDepartmentOptions}
                    />
                    <Combobox
                        label="Class"
                        option={selectedclass}
                        setOption={setSelectedClass}
                        options={allClassOptions}
                    />
                    <Combobox
                        label="Subject"
                        option={selectedSubject}
                        setOption={setSelectedSubject}
                        options={allSubjectOptions}
                    />
                </div>
                <div className="px-6 py-3">

                    <EntriesSelect
                        value={limit}
                        onChange={setLimit}
                        options={limitOptions}
                    />
                </div>
                <div className="min-h-70">
                    <DataTable
                        columns={columns}
                        data={data?.data}
                        loading={isLoading}
                        getRowId={(row) => row._id}
                        selectedRowIds={selectedRowIds}
                        onSelectedRowIdsChange={(ids) =>
                            setSelectedRowIds(ids as string[])
                        }
                    />
                </div>

                <div className="p-6">
                    {data?.meta && (
                        <Pagination
                            metaData={data.meta}
                            loading={isLoading}
                            onPageChange={setPage}
                        />
                    )}
                </div>
            </section>
            <ConfirmationDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                loading={isDeleting}
                variant="danger"
                title="Delete Teacher Assignment?"
                description={
                    selectedTeacherAssignment
                        ? `Are you sure you want to delete this assignment"? This action cannot be undone.`
                        : "Are you sure you want to delete this assignemnt?"
                }
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDelete}
            />
        </>
    );
};

export default TeacherAssignments;