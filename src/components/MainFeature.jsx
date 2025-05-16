import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { getIcon } from '../utils/iconUtils';

const MainFeature = () => {
  // Icons
  const PlusIcon = getIcon('Plus');
  const TrashIcon = getIcon('Trash2');
  const EditIcon = getIcon('Edit');
  const CheckIcon = getIcon('Check');
  const CalendarIcon = getIcon('Calendar');
  const AlertCircleIcon = getIcon('AlertCircle');
  const FlagIcon = getIcon('Flag');
  const SaveIcon = getIcon('Save');
  const XIcon = getIcon('X');
  const ListFilterIcon = getIcon('ListFilter');
  const ArrowUpIcon = getIcon('ArrowUp');
  const ArrowDownIcon = getIcon('ArrowDown');
  const SearchIcon = getIcon('Search');
  const BellIcon = getIcon('Bell');
  const ClockIcon = getIcon('Clock');
  
  // Task states
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [
      {
        id: '1',
        title: 'Create project plan',
        description: 'Outline all the necessary steps and resources for the new dashboard feature',
        status: 'todo',
        priority: 'high',
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
        createdAt: new Date().toISOString(),
        project: 'Dashboard Redesign',
      },
      {
        id: '2',
        title: 'Review feedback from stakeholders',
        description: 'Go through all feedback items from last meeting and categorize by priority',
        status: 'in_progress',
        priority: 'medium',
        dueDate: new Date(Date.now() + 86400000 * 1).toISOString(), // 1 day from now
        createdAt: new Date().toISOString(),
        project: 'User Research',
      },
      {
        id: '3',
        title: 'Complete prototype',
        description: 'Finalize interactive prototype for user testing sessions',
        status: 'completed',
        priority: 'high',
        dueDate: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
        createdAt: new Date().toISOString(),
        project: 'Mobile App',
      }
    ];
  });
  
  // UI States
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    project: '',
  });
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  
  const addFormRef = useRef(null);
  const searchInputRef = useRef(null);
  
  // Save tasks to localStorage when they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  // Handle outside clicks to close the add form
  useEffect(() => {
    function handleClickOutside(event) {
      if (addFormRef.current && !addFormRef.current.contains(event.target)) {
        setIsAddFormVisible(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K for search focus
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Handle adding a new task
  const handleAddTask = (e) => {
    e.preventDefault();
    
    if (!newTask.title.trim()) {
      toast.error("Task title is required");
      return;
    }
    
    const newTaskObj = {
      id: Date.now().toString(),
      ...newTask,
      createdAt: new Date().toISOString(),
    };
    
    setTasks([...tasks, newTaskObj]);
    setNewTask({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      project: '',
    });
    
    setIsAddFormVisible(false);
    toast.success("Task added successfully");
  };
  
  // Handle editing a task
  const startEditing = (task) => {
    setEditingTask(task.id);
    setEditForm({
      ...task,
      dueDate: task.dueDate.split('T')[0],
    });
  };
  
  const cancelEditing = () => {
    setEditingTask(null);
    setEditForm({});
  };
  
  const saveEdit = (id) => {
    if (!editForm.title.trim()) {
      toast.error("Task title is required");
      return;
    }
    
    setTasks(tasks.map(task => 
      task.id === id ? { ...editForm, dueDate: new Date(editForm.dueDate).toISOString() } : task
    ));
    
    setEditingTask(null);
    toast.success("Task updated successfully");
  };
  
  // Handle deleting a task
  const handleDeleteTask = (id) => {
    if (confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter(task => task.id !== id));
      toast.success("Task deleted successfully");
      if (selectedTaskId === id) {
        setSelectedTaskId(null);
      }
    }
  };
  
  // Handle changing a task's status
  const handleStatusChange = (id, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    ));
    
    const statusMessages = {
      'todo': "Task moved to To Do",
      'in_progress': "Task moved to In Progress",
      'completed': "Task marked as completed!",
      'archived': "Task archived"
    };
    
    toast.info(statusMessages[newStatus] || "Status updated");
  };
  
  // Get filtered and sorted tasks
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.project && task.project.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStatus && matchesPriority && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'dueDate') {
      return sortDirection === 'asc' 
        ? new Date(a.dueDate) - new Date(b.dueDate)
        : new Date(b.dueDate) - new Date(a.dueDate);
    } else if (sortBy === 'priority') {
      const priorityValues = { 'low': 1, 'medium': 2, 'high': 3, 'urgent': 4 };
      return sortDirection === 'asc' 
        ? priorityValues[a.priority] - priorityValues[b.priority]
        : priorityValues[b.priority] - priorityValues[a.priority];
    } else if (sortBy === 'title') {
      return sortDirection === 'asc' 
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
    return 0;
  });
  
  // Helper for priority color classes
  const getPriorityClasses = (priority) => {
    switch (priority) {
      case 'low': 
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'medium': 
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'high': 
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      case 'urgent': 
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default: 
        return 'bg-surface-100 text-surface-700 dark:bg-surface-700/30 dark:text-surface-300';
    }
  };
  
  // Helper for status color classes
  const getStatusClasses = (status) => {
    switch (status) {
      case 'todo': 
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300';
      case 'in_progress': 
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'completed': 
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'archived': 
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800/60 dark:text-gray-300';
      default: 
        return 'bg-surface-100 text-surface-700 dark:bg-surface-700/30 dark:text-surface-300';
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  // Is a date in the past
  const isPastDue = (dateString) => {
    return new Date(dateString) < new Date() && dateString;
  };
  
  // Selected task display
  const selectedTask = tasks.find(task => task.id === selectedTaskId);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Task List Column */}
      <motion.div 
        className="md:col-span-2 flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6 flex flex-col md:flex-row md:items-center gap-3 md:gap-4 justify-between">
          <h2 className="text-2xl font-bold flex items-center">
            <ListFilterIcon size={22} className="mr-2 text-primary" />
            My Tasks <span className="ml-2 text-sm bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 px-2 py-0.5 rounded-full">{filteredTasks.length}</span>
          </h2>
          
          <div className="relative">
            <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search tasks... (Ctrl+K)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border-2 border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 w-full md:w-60 focus:outline-none focus:border-primary dark:focus:border-primary"
            />
          </div>
        </div>
        
        {/* Filters and Sorting Section */}
        <div className="mb-4 p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-sm rounded-md border-2 border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 px-2 py-1"
              >
                <option value="all">All Status</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
              
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="text-sm rounded-md border-2 border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 px-2 py-1"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <span className="text-surface-500 dark:text-surface-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-md border-2 border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 px-2 py-1"
              >
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
              
              <button
                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                className="p-1 rounded-md border-2 border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800"
                aria-label={sortDirection === 'asc' ? 'Sort descending' : 'Sort ascending'}
              >
                {sortDirection === 'asc' ? <ArrowUpIcon size={16} /> : <ArrowDownIcon size={16} />}
              </button>
            </div>
          </div>
        </div>
      
        {/* Add Task Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsAddFormVisible(true)}
          className="mb-6 btn btn-primary w-full shadow-lg shadow-primary/20 dark:shadow-primary/10 group"
        >
          <PlusIcon size={18} className="mr-2 transition-transform group-hover:rotate-90" />
          Add New Task
        </motion.button>
      
        {/* Add Task Form */}
        <AnimatePresence>
          {isAddFormVisible && (
            <motion.div
              ref={addFormRef}
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="mb-6 p-4 rounded-xl border-2 border-primary/50 bg-white dark:bg-surface-800 shadow-soft overflow-hidden"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <PlusIcon size={20} className="mr-2 text-primary" />
                Create New Task
              </h3>
              
              <form onSubmit={handleAddTask} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block mb-1 font-medium">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    placeholder="What needs to be done?"
                    className="input"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block mb-1 font-medium">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    placeholder="Add more details about this task..."
                    className="input min-h-[100px]"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dueDate" className="block mb-1 font-medium">
                      Due Date
                    </label>
                    <input
                      id="dueDate"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                      className="input"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="priority" className="block mb-1 font-medium">
                      Priority
                    </label>
                    <select
                      id="priority"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                      className="input"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="project" className="block mb-1 font-medium">
                    Project
                  </label>
                  <input
                    id="project"
                    type="text"
                    value={newTask.project}
                    onChange={(e) => setNewTask({...newTask, project: e.target.value})}
                    placeholder="Optional project name"
                    className="input"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddFormVisible(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    <SaveIcon size={18} className="mr-2" />
                    Save Task
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Tasks List */}
        {filteredTasks.length > 0 ? (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {filteredTasks.map(task => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{
                    layout: { duration: 0.2 },
                    opacity: { duration: 0.2 }
                  }}
                  className={`p-4 rounded-xl border border-surface-200 dark:border-surface-700 ${
                    task.id === selectedTaskId 
                      ? 'bg-primary/5 dark:bg-primary/10 border-primary/30' 
                      : 'bg-white dark:bg-surface-800 hover:shadow-soft dark:hover:bg-surface-700/50'
                  } transition-all cursor-pointer`}
                  onClick={() => setSelectedTaskId(task.id === selectedTaskId ? null : task.id)}
                >
                  {editingTask === task.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                        className="input"
                        onClick={(e) => e.stopPropagation()}
                      />
                      
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        className="input min-h-[80px]"
                        onClick={(e) => e.stopPropagation()}
                      />
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block mb-1 text-sm">Due Date</label>
                          <input
                            type="date"
                            value={editForm.dueDate}
                            onChange={(e) => setEditForm({...editForm, dueDate: e.target.value})}
                            className="input"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        
                        <div>
                          <label className="block mb-1 text-sm">Priority</label>
                          <select
                            value={editForm.priority}
                            onChange={(e) => setEditForm({...editForm, priority: e.target.value})}
                            className="input"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block mb-1 text-sm">Project</label>
                        <input
                          type="text"
                          value={editForm.project}
                          onChange={(e) => setEditForm({...editForm, project: e.target.value})}
                          className="input"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            cancelEditing();
                          }}
                          className="btn btn-outline"
                        >
                          <XIcon size={16} className="mr-1" />
                          Cancel
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            saveEdit(task.id);
                          }}
                          className="btn btn-primary"
                        >
                          <SaveIcon size={16} className="mr-1" />
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between mb-2">
                        <div className="flex space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusClasses(task.status)}`}>
                            {task.status === 'todo' ? 'To Do' : 
                             task.status === 'in_progress' ? 'In Progress' : 
                             task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                          </span>
                          
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityClasses(task.priority)}`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </span>
                        </div>
                        
                        <div className="flex space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(task);
                            }}
                            className="p-1 text-surface-500 hover:text-primary transition-colors"
                            aria-label="Edit task"
                          >
                            <EditIcon size={16} />
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTask(task.id);
                            }}
                            className="p-1 text-surface-500 hover:text-red-500 transition-colors"
                            aria-label="Delete task"
                          >
                            <TrashIcon size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <h3 className={`font-medium mb-1 ${task.status === 'completed' ? 'line-through text-surface-500 dark:text-surface-400' : ''}`}>
                        {task.title}
                      </h3>
                      
                      {task.description && (
                        <p className="text-sm text-surface-600 dark:text-surface-400 mb-3 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-y-2 justify-between text-xs">
                        <div className="flex items-center">
                          <CalendarIcon size={14} className="mr-1" />
                          <span className={`${isPastDue(task.dueDate) && task.status !== 'completed' ? 'text-red-500 font-medium' : 'text-surface-500 dark:text-surface-400'}`}>
                            {formatDate(task.dueDate)}
                          </span>
                        </div>
                        
                        {task.project && (
                          <div className="flex items-center">
                            <span className="text-surface-500 dark:text-surface-400">
                              {task.project}
                            </span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-100 dark:bg-surface-800 mb-4">
              <AlertCircleIcon size={32} className="text-surface-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">No tasks found</h3>
            <p className="text-surface-500 dark:text-surface-400 mb-6">
              {searchTerm 
                ? `No tasks match "${searchTerm}" with the current filters.` 
                : "There are no tasks with the selected filters."}
            </p>
            
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="btn btn-outline mx-auto"
              >
                Clear Search
              </button>
            )}
          </motion.div>
        )}
      </motion.div>
      
      {/* Task Detail Panel */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="md:col-span-1"
      >
        <div className="sticky top-20">
          <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700 h-full p-4">
            {selectedTask ? (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">{selectedTask.title}</h3>
                
                <div className="flex flex-wrap gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusClasses(selectedTask.status)}`}>
                    {selectedTask.status === 'todo' ? 'To Do' : 
                     selectedTask.status === 'in_progress' ? 'In Progress' : 
                     selectedTask.status.charAt(0).toUpperCase() + selectedTask.status.slice(1)}
                  </span>
                  
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityClasses(selectedTask.priority)}`}>
                    {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)} Priority
                  </span>
                </div>
                
                {selectedTask.description && (
                  <div>
                    <h4 className="text-sm font-semibold text-surface-500 dark:text-surface-400 mb-2">Description</h4>
                    <p className="text-sm whitespace-pre-line bg-white dark:bg-surface-800 p-3 rounded-lg border border-surface-200 dark:border-surface-700">
                      {selectedTask.description}
                    </p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CalendarIcon size={16} className="mr-2 text-primary" />
                    <div>
                      <h4 className="text-sm font-semibold">Due Date</h4>
                      <p className={`text-sm ${isPastDue(selectedTask.dueDate) && selectedTask.status !== 'completed' ? 'text-red-500 font-medium' : ''}`}>
                        {formatDate(selectedTask.dueDate)}
                      </p>
                    </div>
                  </div>
                  
                  {selectedTask.project && (
                    <div className="flex items-center">
                      <FlagIcon size={16} className="mr-2 text-primary" />
                      <div>
                        <h4 className="text-sm font-semibold">Project</h4>
                        <p className="text-sm">{selectedTask.project}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <ClockIcon size={16} className="mr-2 text-primary" />
                    <div>
                      <h4 className="text-sm font-semibold">Created</h4>
                      <p className="text-sm">{formatDate(selectedTask.createdAt)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <h4 className="text-sm font-semibold text-surface-500 dark:text-surface-400 mb-3">Update Status</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedTask.status !== 'todo' && (
                      <button
                        onClick={() => handleStatusChange(selectedTask.id, 'todo')}
                        className="btn btn-outline text-xs py-1.5"
                      >
                        To Do
                      </button>
                    )}
                    
                    {selectedTask.status !== 'in_progress' && (
                      <button
                        onClick={() => handleStatusChange(selectedTask.id, 'in_progress')}
                        className="btn btn-outline text-xs py-1.5 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-800"
                      >
                        In Progress
                      </button>
                    )}
                    
                    {selectedTask.status !== 'completed' && (
                      <button
                        onClick={() => handleStatusChange(selectedTask.id, 'completed')}
                        className="btn btn-outline text-xs py-1.5 text-green-600 dark:text-green-400 border-green-300 dark:border-green-800"
                      >
                        <CheckIcon size={14} className="mr-1" />
                        Complete
                      </button>
                    )}
                    
                    {selectedTask.status !== 'archived' && (
                      <button
                        onClick={() => handleStatusChange(selectedTask.id, 'archived')}
                        className="btn btn-outline text-xs py-1.5 text-surface-500"
                      >
                        Archive
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="pt-3 flex justify-end">
                  <button
                    onClick={() => startEditing(selectedTask)}
                    className="btn btn-primary text-sm"
                  >
                    <EditIcon size={16} className="mr-1" />
                    Edit Task
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 flex flex-col items-center justify-center text-center h-full">
                <BellIcon size={48} className="text-surface-300 dark:text-surface-600 mb-4" />
                <h3 className="text-xl font-medium mb-2">No task selected</h3>
                <p className="text-surface-500 dark:text-surface-400">
                  Select a task from the list to view its details and manage its status
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MainFeature;