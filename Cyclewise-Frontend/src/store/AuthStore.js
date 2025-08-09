import { create } from 'zustand';

const AuthStore = create((set) => ({
  isAuthenticated: false,
    hasInitialized: false, 
  user: null,

  login: (userData) => set({ isAuthenticated: true, user: userData }),

  logout: () => set({ isAuthenticated: false, user: null }),

  initialization:()=>{
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const firstName = localStorage.getItem("firstName");
    if(token && email && firstName){
      set({
        isAuthenticated:true,
        user:{email,firstName},
        hasInitialized: true,
      });
    }else{
      set({
        isAuthenticated : false,
        hasInitialized: true,
      });
    }
  }
}));

export default AuthStore;
