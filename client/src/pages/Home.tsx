import { useEffect, useState } from "react";
import { getItems, deleteItem } from "@/api/itemApi";
import { ItemCard } from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import { UpdateItemDialog } from "@/components/UpdateItem";
import { ViewItemDialog } from "@/components/ViewItem";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Home() {
    const [items, setItems] = useState([]);
    const [openEdit, setOpenEdit] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchItems = async () => {
        const res = await getItems();
        setItems(res.data.data);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleDelete = async (id: string) => {
        setIsDeleting(true);
        try {
            await deleteItem(id);
            toast.success("Item deleted successfully");
        } catch (error) {
            toast.error("Failed to delete item");
        } finally {
            setIsDeleting(false);
            fetchItems();
        }

    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Items</h1>
                <Button onClick={() => navigate("/add")}>Add New</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item: any) => (
                    <ItemCard
                        key={item._id}
                        item={item}
                        onDelete={handleDelete}
                        isDeleting={isDeleting}
                        onEdit={(item: any) => {
                            setSelectedItem(item);
                            setOpenEdit(true);
                        }}
                        onView={(item: any) => {
                            setSelectedItem(item);
                            setOpenView(true);
                        }}
                    />
                ))}
            </div>

            {selectedItem && (
                <>
                    <UpdateItemDialog
                        open={openEdit}
                        onOpenChange={setOpenEdit}
                        item={selectedItem}
                        onUpdate={fetchItems}
                    />
                    <ViewItemDialog
                        open={openView}
                        onOpenChange={setOpenView}
                        item={selectedItem}
                    />
                </>
            )}
        </div>
    );
}
