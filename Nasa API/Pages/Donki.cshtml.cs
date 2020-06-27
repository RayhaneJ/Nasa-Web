using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Nasa_API.Pages
{
    public class DonkiModel : PageModel
    {
        public void OnGet()
        {
            IList<string> donkiEvents = new List<string>();
            donkiEvents.Add("Coronal Mass Ejection (CME)");
            donkiEvents.Add("Geomagnetic Storm (GST)");
            donkiEvents.Add("Interplanetary Shock (IPS)");
            donkiEvents.Add("Solar Flare (FLR)");
            donkiEvents.Add("Solar Energetic Particle (SEP)");
            donkiEvents.Add("Magnetopause Crossing (MPC)");
            donkiEvents.Add("Radiation Belt Enhancement (RBE)");
            donkiEvents.Add("Hight Speed Stream (HSS)");
            donkiEvents.Add("WSA+EnlilSimulation");
            donkiEvents.Add("Notifications");

            TempData["donkiEvents"] = donkiEvents;
        }
    }
}