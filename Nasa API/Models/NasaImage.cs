using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Nasa_API.Models
{
    public class NasaImage
    {
        public DateTime Date { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Url { get; set; }
        public string MediaType { get; set; }
    }
}
