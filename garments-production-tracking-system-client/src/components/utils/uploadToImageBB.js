const uploadToImageBB = async (files) => {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    const urls = [];
    for (const file of files) {
        const formData = new FormData();
        formData.append("image", file);
        const res = await fetch(
            `https://api.imgbb.com/1/upload?key=${apiKey}`,
            {
                method: "POST",
                body: formData
            }
        );
        const result = await res.json();
        if (!result.success) {
            throw new Error("Image upload failed");
        }
        urls.push(result.data.url);
    }
    return urls;
};

export default uploadToImageBB;