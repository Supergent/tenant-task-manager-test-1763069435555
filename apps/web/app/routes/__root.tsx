import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Meta, Scripts } from '@tanstack/start'
import * as React from 'react'
import { ConvexAuthProvider } from '@convex-dev/better-auth/react'
import { ConvexProvider, ConvexReactClient } from 'convex/react'

// Create Convex client
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string)

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Task Manager',
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <ConvexProvider client={convex}>
        <ConvexAuthProvider>
          <Outlet />
        </ConvexAuthProvider>
      </ConvexProvider>
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <Meta />
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
              'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
              sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            background-color: #f5f5f5;
            color: #333;
          }

          code {
            font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
              monospace;
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
          }

          .card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 20px;
            margin-bottom: 20px;
          }

          .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
          }

          .btn:hover {
            opacity: 0.9;
          }

          .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .btn-primary {
            background-color: #007bff;
            color: white;
          }

          .btn-danger {
            background-color: #dc3545;
            color: white;
          }

          .btn-success {
            background-color: #28a745;
            color: white;
          }

          .btn-secondary {
            background-color: #6c757d;
            color: white;
          }

          .form-group {
            margin-bottom: 15px;
          }

          .form-label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
          }

          .form-input,
          .form-select,
          .form-textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
          }

          .form-textarea {
            resize: vertical;
            min-height: 100px;
          }

          .form-input:focus,
          .form-select:focus,
          .form-textarea:focus {
            outline: none;
            border-color: #007bff;
          }

          .error {
            color: #dc3545;
            font-size: 14px;
            margin-top: 5px;
          }

          .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
          }

          .badge-low {
            background-color: #d4edda;
            color: #155724;
          }

          .badge-medium {
            background-color: #fff3cd;
            color: #856404;
          }

          .badge-high {
            background-color: #f8d7da;
            color: #721c24;
          }

          .badge-todo {
            background-color: #e2e3e5;
            color: #383d41;
          }

          .badge-in-progress {
            background-color: #d1ecf1;
            color: #0c5460;
          }

          .badge-done {
            background-color: #d4edda;
            color: #155724;
          }

          .task-list {
            list-style: none;
          }

          .task-item {
            background: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 15px;
            margin-bottom: 10px;
            transition: box-shadow 0.2s;
          }

          .task-item:hover {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }

          .task-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }

          .task-title {
            font-size: 18px;
            font-weight: 600;
            margin: 0;
          }

          .task-actions {
            display: flex;
            gap: 10px;
          }

          .task-meta {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
          }

          .task-description {
            color: #666;
            margin-bottom: 10px;
          }

          .filters {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            flex-wrap: wrap;
          }

          .header {
            background: white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
          }

          .header-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .header-title {
            font-size: 24px;
            font-weight: 700;
            margin: 0;
          }

          .loading {
            text-align: center;
            padding: 40px;
            color: #666;
          }

          .empty-state {
            text-align: center;
            padding: 40px;
            color: #666;
          }

          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }

          .modal {
            background: white;
            border-radius: 8px;
            padding: 20px;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }

          .modal-title {
            font-size: 20px;
            font-weight: 600;
            margin: 0;
          }

          .modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
          }
        `}</style>
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
