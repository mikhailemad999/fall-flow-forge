import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { UserIcon, Mail, Calendar, Award, Target, TrendingUp } from 'lucide-react';
import { type User } from '@/lib/auth';
import { taskService } from '@/lib/tasks';

interface ProfileProps {
  user: User;
}

export const Profile = ({ user }: ProfileProps) => {
  const [stats] = useState(() => taskService.getTaskStats(user.id));
  const tasks = taskService.getTasksByUser(user.id);
  
  const memberSince = new Date().toLocaleDateString();
  const totalCategories = new Set(tasks.map(task => task.category)).size;
  
  const achievements = [
    {
      title: 'Task Creator',
      description: 'Created your first task',
      icon: Target,
      earned: tasks.length > 0,
      color: 'text-primary'
    },
    {
      title: 'Getting Started',
      description: 'Completed 5 tasks',
      icon: Award,
      earned: stats.completed >= 5,
      color: 'text-success'
    },
    {
      title: 'Productivity Pro',
      description: 'Maintained 80% completion rate',
      icon: TrendingUp,
      earned: stats.completionRate >= 80,
      color: 'text-warning'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account and view your progress
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-1">
          <Card className="shadow-soft">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <Avatar className="w-24 h-24 ring-4 ring-primary/20">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <p className="text-muted-foreground">{user.email}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Member since {memberSince}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <UserIcon className="w-4 h-4 text-muted-foreground" />
                <span>Task Manager User</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics & Achievements */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Statistics Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-primary/10">
                  <div className="text-2xl font-bold text-primary">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Total Tasks</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-success/10">
                  <div className="text-2xl font-bold text-success">{stats.completed}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-warning/10">
                  <div className="text-2xl font-bold text-warning">{stats.completionRate}%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-accent/10">
                  <div className="text-2xl font-bold text-accent">{totalCategories}</div>
                  <div className="text-sm text-muted-foreground">Categories</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border transition-smooth hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${achievement.earned ? 'bg-primary/10' : 'bg-muted'}`}>
                        <Icon className={`w-5 h-5 ${achievement.earned ? achievement.color : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                    <Badge variant={achievement.earned ? "default" : "secondary"}>
                      {achievement.earned ? "Earned" : "Locked"}
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Activity Summary */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Activity Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tasks in Progress</span>
                    <Badge variant="secondary">{stats.inProgress}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Overdue Tasks</span>
                    <Badge variant={stats.overdue > 0 ? "destructive" : "default"}>
                      {stats.overdue}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Categories Used</span>
                    <Badge variant="outline">{totalCategories}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Account Status</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="text-center p-4 bg-gradient-primary/10 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">
                  {stats.completionRate >= 80 
                    ? "🌟 Excellent Performance!" 
                    : stats.completionRate >= 60
                    ? "💪 Good Progress!"
                    : "🎯 Keep Going!"
                  }
                </h4>
                <p className="text-sm text-muted-foreground">
                  {stats.completionRate >= 80 
                    ? "You're maintaining an excellent completion rate. Keep up the fantastic work!"
                    : stats.completionRate >= 60
                    ? "You're making good progress. Try to complete a few more tasks to boost your rate."
                    : "Every completed task is a step forward. You've got this!"
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};