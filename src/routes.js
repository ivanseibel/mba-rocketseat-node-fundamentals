import { randomUUID } from 'node:crypto'
import { Database } from "./database.js"
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/users'),
    handler: (req, res) => {
      const { search } = req.query

      return res
      .end(JSON.stringify(database.select('users', search ? {
        name: req.query.search,
        email: req.query.search
      } : null)))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/users'),
    handler: (req, res) => {
      const { name, email } = req.body

      const data = database.insert('users', { 
        id: randomUUID(),
        name, email 
      })
  
      return res.writeHead(201).end(JSON.stringify(data))
    }
  },
  {
    method: 'DELETE', 
    path: buildRoutePath('/users/:id'),
    handler: (req, res) => {
      const deleted = database.delete('users', req.params.id)
      
      if (deleted) {
        return res.writeHead(204).end()
      }
      
      return res.writeHead(404).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/users/:id'),
    handler: (req, res) => {
      const { name, email } = req.body

      const updateData = {}
      if (name !== undefined) updateData.name = name
      if (email !== undefined) updateData.email = email

      const updated = database.update('users', req.params.id, updateData)

      if (updated) {
        return res.end(JSON.stringify(updated))
      }

      console.log('not found')
      return res.writeHead(404).end()
    },
  },
]