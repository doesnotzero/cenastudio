/**
 * ChecklistColumn Component Examples
 *
 * Usage examples for the ChecklistColumn component
 */

import React from 'react';
import { ChecklistColumn, ChecklistTask } from './ChecklistColumn';

// Example 1: Empty Checklist
export function EmptyChecklistExample() {
  const [items, setItems] = React.useState<ChecklistTask[]>([]);

  const handleToggle = (id: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleCreate = (text: string) => {
    const newItem: ChecklistTask = {
      id: Date.now().toString(),
      text,
      checked: false,
    };
    setItems(prev => [...prev, newItem]);
  };

  return (
    <ChecklistColumn
      items={items}
      onToggle={handleToggle}
      onDelete={handleDelete}
      onCreate={handleCreate}
    />
  );
}

// Example 2: Populated Checklist
export function PopulatedChecklistExample() {
  const [items, setItems] = React.useState<ChecklistTask[]>([
    { id: '1', text: 'Review project briefing', checked: false },
    { id: '2', text: 'Approve final budget', checked: true },
    { id: '3', text: 'Schedule client meeting', checked: false },
    { id: '4', text: 'Update project timeline', checked: false },
    { id: '5', text: 'Send invoice', checked: true },
  ]);

  const handleToggle = (id: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleCreate = (text: string) => {
    const newItem: ChecklistTask = {
      id: Date.now().toString(),
      text,
      checked: false,
    };
    setItems(prev => [...prev, newItem]);
  };

  return (
    <ChecklistColumn
      items={items}
      onToggle={handleToggle}
      onDelete={handleDelete}
      onCreate={handleCreate}
    />
  );
}

// Example 3: Checklist with Links
export function ChecklistWithLinksExample() {
  const [items, setItems] = React.useState<ChecklistTask[]>([
    {
      id: '1',
      text: 'Review project briefing',
      checked: false,
      link: '/project/123/briefing'
    },
    {
      id: '2',
      text: 'Check production status',
      checked: false,
      link: '/project/123/production'
    },
    {
      id: '3',
      text: 'Submit for review',
      checked: true,
      link: '/project/123/review'
    },
  ]);

  const handleToggle = (id: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleCreate = (text: string) => {
    const newItem: ChecklistTask = {
      id: Date.now().toString(),
      text,
      checked: false,
    };
    setItems(prev => [...prev, newItem]);
  };

  return (
    <ChecklistColumn
      items={items}
      onToggle={handleToggle}
      onDelete={handleDelete}
      onCreate={handleCreate}
    />
  );
}

// Example 4: With API Integration (mock)
export function ChecklistWithAPIExample() {
  const [items, setItems] = React.useState<ChecklistTask[]>([
    { id: '1', text: 'Review briefing', checked: false },
    { id: '2', text: 'Approve budget', checked: false },
  ]);

  const handleToggle = async (id: string) => {
    // Optimistic update
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );

    try {
      // API call would go here
      // await api.checklist.toggle(id);
      console.log('Toggle API call for:', id);
    } catch (error) {
      // Rollback on error
      setItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, checked: !item.checked } : item
        )
      );
      console.error('Failed to toggle task:', error);
    }
  };

  const handleDelete = async (id: string) => {
    // Optimistic update
    const previousItems = items;
    setItems(prev => prev.filter(item => item.id !== id));

    try {
      // API call would go here
      // await api.checklist.delete(id);
      console.log('Delete API call for:', id);
    } catch (error) {
      // Rollback on error
      setItems(previousItems);
      console.error('Failed to delete task:', error);
    }
  };

  const handleCreate = async (text: string) => {
    const tempId = `temp-${Date.now()}`;
    const newItem: ChecklistTask = {
      id: tempId,
      text,
      checked: false,
    };

    // Optimistic update
    setItems(prev => [...prev, newItem]);

    try {
      // API call would go here
      // const created = await api.checklist.create({ text });
      // Replace temp item with real item
      // setItems(prev => prev.map(item => item.id === tempId ? created : item));
      console.log('Create API call for:', text);
    } catch (error) {
      // Rollback on error
      setItems(prev => prev.filter(item => item.id !== tempId));
      console.error('Failed to create task:', error);
    }
  };

  return (
    <ChecklistColumn
      items={items}
      onToggle={handleToggle}
      onDelete={handleDelete}
      onCreate={handleCreate}
    />
  );
}

// Example 5: Large Checklist (scrollable)
export function LargeChecklistExample() {
  const [items, setItems] = React.useState<ChecklistTask[]>(
    Array.from({ length: 15 }, (_, i) => ({
      id: `item-${i + 1}`,
      text: `Task ${i + 1}: ${i % 3 === 0 ? 'High priority' : 'Normal priority'}`,
      checked: i % 4 === 0,
    }))
  );

  const handleToggle = (id: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleCreate = (text: string) => {
    const newItem: ChecklistTask = {
      id: Date.now().toString(),
      text,
      checked: false,
    };
    setItems(prev => [...prev, newItem]);
  };

  return (
    <ChecklistColumn
      items={items}
      onToggle={handleToggle}
      onDelete={handleDelete}
      onCreate={handleCreate}
    />
  );
}
