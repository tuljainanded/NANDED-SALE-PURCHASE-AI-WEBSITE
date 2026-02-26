const fs = require('fs');
const path = require('path');

console.log("Starting refactor...");

// 1. Rename Model File
const oldModelPath = path.join(__dirname, 'src/models/Listing.ts');
const newModelPath = path.join(__dirname, 'src/models/Post.ts');
if (fs.existsSync(oldModelPath)) {
    fs.renameSync(oldModelPath, newModelPath);
    console.log('Renamed Listing.ts to Post.ts');
} else {
    console.log('Listing.ts not found. Maybe already renamed?');
}

// 2. Rename API Routes Folder (Admin)
const oldAdminApiFolder = path.join(__dirname, 'src/app/api/admin/listings');
const newAdminApiFolder = path.join(__dirname, 'src/app/api/admin/posts');
if (fs.existsSync(oldAdminApiFolder)) {
    fs.renameSync(oldAdminApiFolder, newAdminApiFolder);
    console.log('Renamed /api/admin/listings to /api/admin/posts');
}

// 2.5 Rename normal listings API folder if exists
const oldApiFolder = path.join(__dirname, 'src/app/api/listings');
const newApiFolder = path.join(__dirname, 'src/app/api/posts');
if (fs.existsSync(oldApiFolder)) {
    fs.renameSync(oldApiFolder, newApiFolder);
    console.log('Renamed /api/listings to /api/posts');
}

// Rename frontend folder
const oldFrontendFolder = path.join(__dirname, 'src/app/listings');
const newFrontendFolder = path.join(__dirname, 'src/app/posts');
if (fs.existsSync(oldFrontendFolder)) {
    fs.renameSync(oldFrontendFolder, newFrontendFolder);
    console.log('Renamed src/app/listings to src/app/posts');
}

function walkSync(dir, filelist = []) {
    if (!fs.existsSync(dir)) return filelist;
    fs.readdirSync(dir).forEach(file => {
        const dirFile = path.join(dir, file);
        if (fs.statSync(dirFile).isDirectory()) {
            if (!dirFile.includes('node_modules') && !dirFile.includes('.next') && !dirFile.includes('.git')) {
                filelist = walkSync(dirFile, filelist);
            }
        } else {
            if (dirFile.endsWith('.ts') || dirFile.endsWith('.tsx') || dirFile.endsWith('.js') || dirFile.endsWith('.jsx')) {
                filelist.push(dirFile);
            }
        }
    });
    return filelist;
}

const files = walkSync(path.join(__dirname, 'src'));

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // We do careful replacements.
    // 1. Listings -> Posts
    content = content.replace(/Listings/g, 'Posts');
    // 2. listings -> posts
    content = content.replace(/listings/g, 'posts');
    // 3. Listing -> Post
    content = content.replace(/Listing/g, 'Post');
    // 4. listing -> post
    content = content.replace(/listing/g, 'post');

    // Fix the Post.ts model export line explicitly to match user's requirement
    if (file.endsWith('Post.ts') || file.endsWith('Post.tsx')) {
        // Because Listing became Post, IListing became IPost.
        // We ensure the export matches exactly what the user wants:
        content = content.replace(/const Post = mongoose\.models\.Post \|\| mongoose\.model<IPost>\('Post', PostSchema\);/g,
            "const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);");

        // Let's also handle the exact string the user provided if the above regex fails
        content = content.replace(/const Post = mongoose\.models\.Post \|\| mongoose\.model<IPost>\('Post', PostSchema\);\nexport default Post;/g,
            "const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);\nexport default Post;");
    }

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    }
}

console.log("Refactor complete.");
