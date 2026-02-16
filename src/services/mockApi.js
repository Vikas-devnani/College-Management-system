const wait = (ms=500) => new Promise((r)=>setTimeout(r, ms))

let students = [
  { id:1, name:'Alice Johnson', email:'alice.johnson@example.com', department:'Computer Science', year:3, status:'active' },
  { id:2, name:'Bob Smith', email:'bob.smith@example.com', department:'Business', year:2, status:'active' },
  { id:3, name:'Catherine Lee', email:'catherine.lee@example.com', department:'Mathematics', year:4, status:'inactive' },
  { id:4, name:'David Park', email:'david.park@example.com', department:'Computer Science', year:1, status:'active' },
  { id:5, name:'Eva Green', email:'eva.green@example.com', department:'Physics', year:2, status:'active' },
]
let courses = [ { id:1, title:'Computer Science', code:'CS101', credits:4 }, { id:2, title:'Business Management', code:'BM201', credits:3 } ]
let faculty = [ { id:1, name:'Dr. Emily Carter', department:'Computer Science', email:'emily.carter@college.edu' } ]

export const api = {
  session: {
    validate: ()=> wait(300).then(()=> ({ ok:true }))
  },
  students: {
    list: async ({ page=1, pageSize=10, sortBy='id', sortDir='asc', filter = '' } = {}) => {
      await wait(400)
      let data = students.slice()
      if (filter) data = data.filter(s => s.name.toLowerCase().includes(filter.toLowerCase()) || s.email.toLowerCase().includes(filter.toLowerCase()) )
      data.sort((a,b)=> {
        if (a[sortBy] < b[sortBy]) return sortDir === 'asc' ? -1 : 1
        if (a[sortBy] > b[sortBy]) return sortDir === 'asc' ? 1 : -1
        return 0
      })
      const total = data.length
      const start = (page-1)*pageSize
      const paged = data.slice(start, start+pageSize)
      return { data: paged, total }
    },
    get: async (id) => { await wait(300); return students.find(s=>s.id===id) },
    create: async (payload) => { await wait(300); const id = Math.max(0,...students.map(s=>s.id))+1; const item = { id, ...payload }; students.push(item); return item },
    update: async (id,payload)=>{ await wait(300); students = students.map(s=> s.id===id ? { ...s, ...payload } : s); return students.find(s=>s.id===id) },
    remove: async (id)=>{ await wait(300); students = students.filter(s=>s.id!==id); return { ok:true } }
  },
  courses: {
    list: async ()=> { await wait(200); return courses }
  },
  faculty: {
    list: async ()=> { await wait(200); return faculty }
  }
}
