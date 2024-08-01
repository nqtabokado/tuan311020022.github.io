<?php

namespace App\Http\Controllers;
use App\Models\Employer;

use Illuminate\Http\Request;

class EmployerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function login()
    {
        return view('employers.login');
    }

    public function register()
    {
        return view('employers.register');
    }
}
