import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { taskService, type TaskStats } from '@/lib/tasks';
import { type User } from '@/lib/auth';

interface DashboardProps {
  user: User;
}

export const Dashboard = ({ user }: DashboardProps) => {
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0,
    completionRate: 0
  });

  useEffect(() => {
    // Initialize sample data on first visit
    taskService.initializeSampleData(user.id);
    
    // Load stats
    const taskStats = taskService.getTaskStats(user.id);
    setStats(taskStats);
  }, [user.id]);

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: CheckSquare,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your task progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {stats.completionRate}%
              </div>
              <p className="text-sm text-muted-foreground">
                Tasks Completed
              </p>
            </div>
            <Progress 
              value={stats.completionRate} 
              className="h-3"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{stats.completed} completed</span>
              <span>{stats.total - stats.completed} remaining</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Completion Rate</span>
              <Badge variant={stats.completionRate >= 70 ? "default" : "secondary"}>
                {stats.completionRate >= 70 ? "Good" : "Needs Work"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overdue Tasks</span>
              <Badge variant={stats.overdue > 0 ? "destructive" : "default"}>
                {stats.overdue > 0 ? `${stats.overdue} overdue` : "None"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Tasks</span>
              <Badge variant="outline">
                {stats.inProgress} in progress
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Motivational Message */}
      {stats.total > 0 && (
        <Card className="shadow-soft bg-gradient-primary text-primary-foreground">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">
              {stats.completionRate === 100 
                ? "🎉 Amazing! You've completed all your tasks!"
                : stats.completionRate >= 70
                ? "🚀 Great progress! Keep up the excellent work!"
                : stats.completionRate >= 40
                ? "💪 Good start! You're making steady progress!"
                : "🎯 Let's get started! Every task completed is a step forward!"
              }
            </h3>
            <p className="text-primary-foreground/80">
              {stats.completionRate === 100 
                ? "Time to set new goals and challenges!"
                : "Stay focused and tackle one task at a time."
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};