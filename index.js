(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = []

  const dataPanel = document.getElementById('data-panel')

  axios.get(INDEX_URL).then((response) => {
    data.push(...response.data.results)
    pager(data)
    displayDataList(data)
    
    console.log(data)
  }).catch((err) => console.log(err))

  // listen to data panel
  //add to favorite list
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    }
    else if(event.target.matches('.btn-add-movie')){
      addMoviesToFavorite(event.target.dataset.id)
    }
  })

//search  
let searchForm = document.getElementById("search")
let searchInput = document.getElementById("search-input")

searchForm.addEventListener('submit',function(event){
  event.preventDefault()
  console.log(event.target)
  console.log(searchInput.value)
  const regex = new RegExp(searchInput.value, 'i')
  let searchoutput = data.filter(item => item.title.match(regex))
  console.log(searchoutput)
  displayDataList (searchoutput)
  
})

//page
const pagination = document.getElementById('pagination')
const pageItemNumber = 12
let page = 1
let switchCardList = false

pagination.addEventListener('click',function(event){

  if(event.target.tagName ==='A'){
    page = event.target.innerText
    if(switchCardList === false)
      displayDataList(data)
    else if(switchCardList === true)
      displayDataListByList(data)
    //console.log(page)
  }
})

function pager(data){
let pageContent = ''
let pageNumber = Math.ceil(data.length/pageItemNumber) || 1
  for(let i=1; i<=pageNumber; i++){
    pageContent +=
    `<li class="page-item">
          <a class="page-link" href="#">${i}</a>
    </li>`
  }
pagination.innerHTML = pageContent
}

//display
  const sw = document.getElementById('switch')
  sw.addEventListener('click', function(event){
     console.log(event.target)
     if(event.target.className === "fa fa-th"){
        displayDataList (data)
        switchCardList = false
      }
     else if(event.target.className === "fa fa-bars"){
        displayDataListByList(data)
        switchCardList = true
     }
  })

  function displayDataListByList(data){
    let htmlContent = ''
    let begin = pageItemNumber*page-pageItemNumber
    let end = pageItemNumber*page
    if(end > data.length) end = data.length
    
    for(let i=begin; i<end; i++){
    //data.forEach(function (item) {
      htmlContent += `
    
      <div class="col-8 py-3 border-bottom">${data[i].title}</div>
      <div class="col-4 py-3 border-bottom">
          <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${data[i].id}">More</button>
          <button class="btn btn-info btn-add-movie" data-id="${data[i].id}">+</button>
      </div>
      `
    }
    dataPanel.innerHTML = htmlContent
  }

  function displayDataList (data) {
    let htmlContent = ''
    let begin = pageItemNumber*page-pageItemNumber
    let end = pageItemNumber*page
    if(end > data.length) end = data.length
    
    for(let i=begin; i<end; i++){
    //data.forEach(function (item) {
      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${data[i].image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h5 class="card-title">${data[i].title}</h5>
            </div>

            <!-- "More" button -->
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${data[i].id}">More</button>
              <button class="btn btn-info btn-add-movie" data-id="${data[i].id}">+</button>
            </div>
            
              
            
          </div>
        </div>
      `
    }
    dataPanel.innerHTML = htmlContent
  }

  function showMovie (id) {
    // get elements
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    // set request url
    const url = INDEX_URL + id
    console.log(url)

    // send request to show api
    axios.get(url).then(response => {
      const data = response.data.results
      console.log(data)

      // insert data into modal ui
      modalTitle.textContent = data.title
      modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
      modalDate.textContent = `release at : ${data.release_date}`
      modalDescription.textContent = `${data.description}`
    })
  }

  function addMoviesToFavorite(id){
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    let movie = data.find(item => item.id === Number(id))
    
    if(list.some(item => item.id === Number(id)) ){}
       
    //console.log(movie)
    else{
      list.push(movie)
    }
      //console.log(list)
    localStorage.setItem('favoriteMovies',JSON.stringify(list))
  }
})()
