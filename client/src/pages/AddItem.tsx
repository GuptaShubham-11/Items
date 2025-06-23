import { useState, useEffect } from "react";
import { addItem } from "@/api/itemApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Spinner from "@/components/Spinner";
import { Textarea } from "@/components/ui/textarea";

export default function AddItem() {
    const [form, setForm] = useState({ name: "", type: "", description: "" });
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [additionalImages, setAdditionalImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const urls = additionalImages.map(file => URL.createObjectURL(file));
        setPreviewUrls(urls);
        return () => urls.forEach(url => URL.revokeObjectURL(url));
    }, [additionalImages]);

    const isDuplicate = (file1: File | null, file2: File) =>
        file1 && file1.name === file2.name && file1.size === file2.size;

    const handleAdditionalImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles = Array.from(files);
        const filtered = newFiles.filter(
            (file) =>
                !isDuplicate(coverImage, file) &&
                !additionalImages.some((f) => f.name === file.name && f.size === file.size)
        );

        if (newFiles.some((file) => isDuplicate(coverImage, file))) {
            toast.error("An additional image cannot be the same as the cover image.");
        }

        setAdditionalImages([...additionalImages, ...filtered].slice(0, 3));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            coverImage &&
            additionalImages.some((file) => isDuplicate(coverImage, file))
        ) {
            toast.error("Cover image cannot also be in additional images.");
            return;
        }

        setIsLoading(true);
        try {
            const data = new FormData();
            Object.entries(form).forEach(([key, value]) => data.append(key, value));
            if (coverImage) data.append("coverImage", coverImage);
            additionalImages.forEach((file) => data.append("additionalImages", file));

            await addItem(data);
            toast.success("Item added successfully");
            navigate("/");
        } catch (error) {
            toast.error("Failed to add item");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-2xl bg-white p-8 md:p-10 rounded-xl shadow-md space-y-6"
            >
                <h2 className="text-3xl font-bold text-center text-gray-800">Add New Item</h2>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Item Name</label>
                    <Input
                        placeholder="Enter item name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Type</label>
                    <Input
                        placeholder="Enter type"
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <Textarea
                        placeholder="Enter description"
                        rows={4}
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Cover Image</label>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        Additional Images (Max 3)
                    </label>
                    <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleAdditionalImages}
                    />
                    {previewUrls.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                            {previewUrls.map((url, idx) => (
                                <img
                                    key={idx}
                                    src={url}
                                    alt={`Preview ${idx + 1}`}
                                    className="w-full h-24 object-cover rounded border"
                                />
                            ))}
                        </div>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full text-white text-sm font-medium py-3"
                >
                    {isLoading ? <Spinner /> : "Add Item"}
                </Button>
            </form>
        </div>
    );
}
