using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Nasa_API.Models
{
    public class NasaAsteroid
    { 
        public string Id { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public string Magnitude { get; set; }
        public string Diameter_In_Meters { get; set; }
        public string Kilometers_Per_Second { get; set; }
        public string Miss_Distance_In_Kilometers { get; set; }
    }
}
