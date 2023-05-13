import { getCollection } from "astro:content"


export type TreeNode = {
    name: string,
    type: "folder" | "file",
    children: TreeNode[]
}


export async function createTree() {
    const notes = await getCollection('notes')
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
        folders.forEach((folder, index, arr) => {
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

export async function createStaticPaths() {
    const notes = await getCollection('notes')
    
    const paths = new Set<string>()
    
    notes.forEach(note => {
        const segments = note.slug.split("/").slice(0, -1)
        
        segments.forEach((_, index, arr) => {
            paths.add(arr.slice(0, index + 1).join("/"))
        })
    })
    const result: { params: { slug: string } }[] = []
    paths.forEach(item => {
        result.push({
            params: {
                slug: item
            }
        })
    })

    return result
}

export async function getChildren(path: string) {
    const tree = await createTree()
    const segments = path.split("/")
    let pointer = tree
    segments.forEach(segment => {
        pointer = pointer.children.find(treeNode => treeNode.name === segment)!
    })
    
    return pointer.children
}