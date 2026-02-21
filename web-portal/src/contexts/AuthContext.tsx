import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
    type User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider, 
    signInWithPopup
} from 'firebase/auth';
import { auth } from "../configs/firebase";

interface AuthContextType {
    currentUser: User | null;
    signup: (email: string, password: string) => Promise<never>;
    login: (email: string, password: string) => Promise<never>;
    logout: () => Promise<void>;
    signInWithGoogle: () => Promise<never>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Signup with email and password
    function signup(email: string, password: string) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

  // Login with email and password
    function login(email: string, password: string) {
        return signInWithEmailAndPassword(auth, email, password);
    }

  // Logout
    function logout() {
        return signOut(auth);
    }

    // Google Sign In
    function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        signup,
        login,
        logout,
        signInWithGoogle,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
        {!loading && children}
        </AuthContext.Provider>
    );
}