// Simulated JWT Authentication System
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface AuthToken {
  token: string;
  user: User;
  expiresAt: number;
}

class AuthService {
  private readonly TOKEN_KEY = 'task_manager_token';
  private readonly USERS_KEY = 'task_manager_users';

  // Mock users database
  private initializeUsers() {
    const users = this.getUsers();
    if (users.length === 0) {
      const defaultUsers = [
        {
          id: '1',
          email: 'demo@example.com',
          name: 'Demo User',
          password: 'password123'
        }
      ];
      localStorage.setItem(this.USERS_KEY, JSON.stringify(defaultUsers));
    }
  }

  private getUsers() {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  private generateToken(): string {
    return btoa(`${Date.now()}_${Math.random()}`);
  }

  login(email: string, password: string): Promise<AuthToken> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.initializeUsers();
        const users = this.getUsers();
        const user = users.find((u: any) => u.email === email && u.password === password);
        
        if (user) {
          const token = this.generateToken();
          const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
          
          const authToken: AuthToken = {
            token,
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              avatar: user.avatar
            },
            expiresAt
          };
          
          localStorage.setItem(this.TOKEN_KEY, JSON.stringify(authToken));
          resolve(authToken);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000); // Simulate network delay
    });
  }

  register(email: string, password: string, name: string): Promise<AuthToken> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.initializeUsers();
        const users = this.getUsers();
        
        if (users.find((u: any) => u.email === email)) {
          reject(new Error('User already exists'));
          return;
        }

        const newUser = {
          id: Date.now().toString(),
          email,
          password,
          name,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
        };

        users.push(newUser);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

        // Auto login after registration
        this.login(email, password).then(resolve).catch(reject);
      }, 1000);
    });
  }

  getCurrentUser(): User | null {
    const tokenData = localStorage.getItem(this.TOKEN_KEY);
    if (!tokenData) return null;

    try {
      const authToken: AuthToken = JSON.parse(tokenData);
      if (Date.now() > authToken.expiresAt) {
        this.logout();
        return null;
      }
      return authToken.user;
    } catch {
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}

export const authService = new AuthService();