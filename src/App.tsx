import { Container } from "react-bootstrap"
import { Routes, Route, Navigate } from "react-router-dom"
import { NewNote } from "./NewNote"
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocalStorage } from "./useLocalStorage";
import { useMemo } from "react";
import {v4 as uuidV4} from "uuid"
import { NoteList } from "./NoteList";
import { NoteLayout } from "./NoteLayout"
import { Note } from "./Note";
import { EditNote } from "./EditNote";

export type Note = {
  id: string
} & NoteData


export type NoteData = {
  title: string
  markdown: string
  tags: Tag[]
}

export type Tag = {
  id: string
  label: string
}

export type RawNote = {
  id: string
} & RawNoteData

export type RawNoteData = {
  title: string
  markdown: string
  tagsIds: string[]
}

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", [])
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", [])

  const notesWithTags = useMemo(() => {
    return notes.map(note => {
      return  { ...note, tags: tags.filter(tag => note.tagsIds.includes(tag.id)) }
    })
  }, [notes, tags])

  function onCreateNote({tags, ...data}: NoteData) {
    setNotes(prevNotes => {
      return [...prevNotes, { ...data, id: uuidV4(), tagsIds: tags.map(tag => tag.id)}]
    })
  }

  function onUpdateNote(id: string, { tags, ...data}: NoteData) {
    setNotes(prevNotes => {
      return prevNotes.map(note => {
        if (note.id === id) {
          return { ...note, ...data, tagsIds: tags.map(tag => tag.id) }
        } else {
          return note
        }
      })
      
    })
  }
  
  function addTag(tag: Tag) {
    setTags(prev => [...prev, tag])
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route path="/" element={<NoteList notes={notesWithTags} availableTags={tags}/>} />
        <Route path="/new" element={<NewNote onSubmit={onCreateNote} onAddTag={addTag} availableTags={tags} />} />
        <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}> 
          <Route index element={<Note />} />
          <Route path="edit" element={<EditNote onSubmit={onUpdateNote} onAddTag={addTag} availableTags={tags} />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  )
  
}

export default App