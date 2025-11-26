import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Register } from './pages/auth/register/register';
import { Login } from './pages/auth/login/login';

import { WordsList } from './pages/words/words-list/words-list';
import { AddWord } from './pages/words/add-word/add-word';
import { EditWord } from './pages/words/edit-word/edit-word';
import { WordDetail } from './pages/words/word-detail/word-detail';

import { NotesList } from './pages/notes/notes-list/notes-list';
import { AddNote } from './pages/notes/add-note/add-note';
import { EditNote } from './pages/notes/edit-note/edit-note';
import { NoteDetail } from './pages/notes/note-detail/note-detail';

import { Quiz } from './pages/quiz/quiz';


export const routes: Routes = [
    { path: '', component: Home },
    { path: 'dashboard', component: Home },
    { path: 'login', component: Login },
    { path: 'register', component: Register },

    { path: 'words', component: WordsList },
    { path: 'words/new', component: AddWord }, 
    { path: 'words/edit/:id', component: EditWord },
    { path: 'words/:id', component: WordDetail },    

    { path: 'notes', component: NotesList },
    { path: 'notes/new', component: AddNote }, 
    { path: 'notes/edit/:id', component: EditNote },
    { path: 'notes/:id', component: NoteDetail }, 
    
    { path: 'quiz', component: Quiz }
];
