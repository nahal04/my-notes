import type { CollectionEntry } from "astro:content";


type TreeNode = {
    name: string,
    type: "folder" | "file",
    children: TreeNode[]
}


export function createTree(notes: CollectionEntry<'notes'>[]) {
    const root: TreeNode = {
        name: "root",
        type: "folder",
        children: []
    }

    
    notes.forEach(note => {
        let curr = root
        const pathArr = note.slug.split('/')
        const file = pathArr.pop()
        const folders = pathArr
        folders.forEach((folder) => {
            const dir = curr.children.find(item => item.name === folder)

            if (!dir) {
                curr.children.push({
                    name: folder,
                    type: 'folder',
                    children: []
                })
                curr = curr.children[curr.children.length - 1]
            } else {
                curr = dir
            }

        })

        if (file) {   
            curr.children.push({
                name: file,
                type: 'file',
                children: []
            })
        }
    })
    return root
}