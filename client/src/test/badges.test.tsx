import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../components/Badge';

describe('Status, Priority, and Category Badges', () => {
  it('renders status badge for IN_PROGRESS', () => {
    render(<StatusBadge status="IN_PROGRESS" />);
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('renders status badge for RESOLVED', () => {
    render(<StatusBadge status="RESOLVED" />);
    expect(screen.getByText('Resolved')).toBeInTheDocument();
  });

  it('renders status badge for REJECTED', () => {
    render(<StatusBadge status="REJECTED" />);
    expect(screen.getByText('Rejected')).toBeInTheDocument();
  });

  it('renders priority badge for URGENT', () => {
    render(<PriorityBadge priority="URGENT" />);
    expect(screen.getByText('Urgent')).toBeInTheDocument();
  });

  it('renders category badge for Electricity', () => {
    render(<CategoryBadge category="Electricity" />);
    expect(screen.getByText('Electricity')).toBeInTheDocument();
  });
});
