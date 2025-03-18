using BookstoreProject.API.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookstoreProject.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class BookstoreController : ControllerBase
    {
        private BookstoreDbContext _context;
        public BookstoreController(BookstoreDbContext temp)
        {
            _context = temp;
        }

        public IEnumerable<Book> Get()
        {
            return _context.Books.ToList();
        }
    }
}
