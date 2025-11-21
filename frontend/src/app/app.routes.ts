import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Register } from './pages/auth/register/register';
import { Login } from './pages/auth/login/login';

import { WordsList } from './pages/words/words-list/words-list';
import { AddWord } from './pages/words/add-word/add-word';
import { EditWord } from './pages/words/edit-word/edit-word';
import { WordDetail } from './pages/words/word-detail/word-detail';

import { NotesList } from './pages/notes/notes-list/notes-list';
import { Quiz } from './services/quiz';


export const routes: Routes = [
    { path: '', component: Home },
    { path: 'home', component: Home },
    { path: 'login', component: Login },
    { path: 'register', component: Register },

    { path: 'words', component: WordsList },
    { path: 'words/:id', component: WordDetail },

    { path: 'words/new', component: AddWord }, 
    { path: 'words/edit/:id', component: EditWord },

    { path: 'notes', component: NotesList },

    
    { path: 'quiz', component: Quiz }
];
