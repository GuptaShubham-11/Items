import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import Spinner from "./Spinner";

export const ItemCard = ({ item, onDelete, onEdit, onView, isDeleting }: any) => {
    return (
        <div
            key={item._id}
            onClick={() => onView(item)}
            className="bg-white shadow-sm border rounded-xl p-4 w-full max-w-sm cursor-pointer transition hover:shadow-md"
        >
            <img
                src={item.coverImage}
                alt={item.name}
                className="rounded-md h-48 w-full object-cover mb-4"
            />

            <h2 className="text-lg font-semibold mb-1">{item.name}</h2>
            <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>

            <div
                className="flex gap-2 mt-4"
                onClick={(e) => e.stopPropagation()}
            >
                <Button
                    onClick={() => onEdit(item)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                >
                    <Pencil size={14} />
                    Edit
                </Button>
                <Button
                    onClick={() => onDelete(item._id)}
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-1"
                    disabled={isDeleting}
                >
                    {isDeleting ? (
                        <Spinner />
                    ) : (
                        <>
                            <Trash2 size={14} />
                            Delete
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};
